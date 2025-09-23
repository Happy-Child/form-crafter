import { ComponentsSchemas, errorCodes, getErrorMessage } from '@form-crafter/core'
import { genId } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'
import { componentsBuildersTypes } from 'packages/core/src/options-builder/consts'

import { AppErrorsService } from '../../../app-errors'
import { SchemaService } from '../../../schema'
import { GroupValidationRuleSchemas } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import {
    buildFlattenGraphAndFindCycles,
    buildReverseDepsGraph,
    buildTopologicalSortedGraph,
    DepsByValidationRules,
    extractComponentsMutationsDeps,
    extractComponentsValidationsConditionsDeps,
    extractValidationsSchemasConditionsDeps,
    extractViewsConditionsDeps,
    extractVisabilityConditionsDeps,
    mergeDeps,
} from './utils'

type Params = {
    initialComponentsSchemas: ComponentsSchemas
    appErrorsService: AppErrorsService
    themeService: ThemeService
    viewsService: ViewsService
    schemaService: SchemaService
}

export type DepsOfRulesModel = ReturnType<typeof createDepsOfRulesModel>

export const createDepsOfRulesModel = ({ initialComponentsSchemas, appErrorsService, themeService, viewsService, schemaService }: Params) => {
    const $componentsMutationsDeps = combine(themeService.$pathsToMutationsRulesDeps, (pathsToDeps) =>
        extractComponentsMutationsDeps(initialComponentsSchemas, pathsToDeps),
    )

    const $visabilityConditionsDeps = createStore(extractVisabilityConditionsDeps(initialComponentsSchemas))

    const $componentsValidationsConditionsDeps = createStore(extractComponentsValidationsConditionsDeps(initialComponentsSchemas))

    const $groupsValidationsConditionsDeps = combine<GroupValidationRuleSchemas, DepsByValidationRules>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const schemas = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const ruleIdToDepsComponents = extractValidationsSchemasConditionsDeps(schemas)
            return { ruleIdToDepsComponents, componentsToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponents) }
        },
    )

    const $viewsConditionsDeps = combine(viewsService.$additionalsViews, extractViewsConditionsDeps)

    const $viewsConditionsAllDeps = combine(
        $viewsConditionsDeps,
        (viewsConditionsDeps) => new Set(Object.values(viewsConditionsDeps.viewIdToDepsComponents).flat(1)),
    )

    const $depsTriggeringMutations = combine($componentsMutationsDeps, $visabilityConditionsDeps, (depsByMutation, depsByVisability) => ({
        componentIdToDeps: mergeDeps(depsByMutation.componentIdToDeps, depsByVisability.componentIdToDeps),
        componentIdToDependents: mergeDeps(depsByMutation.componentIdToDependents, depsByVisability.componentIdToDependents),
    }))

    const $infoOfGraphMutationResolution = combine($depsTriggeringMutations, ({ componentIdToDependents }) => {
        const flattenGraphInfo = buildFlattenGraphAndFindCycles(componentIdToDependents)
        return { ...flattenGraphInfo, graph: componentIdToDependents }
    })
    const $depsGraphForMutationResolution = combine($infoOfGraphMutationResolution, ({ flattenGraph }) => flattenGraph)

    const $depsForAllMutationResolution = combine($depsTriggeringMutations, ({ componentIdToDeps }) => {
        const dependentsGraph = { root: Object.keys(componentIdToDeps) }
        const { root } = buildTopologicalSortedGraph(dependentsGraph, componentIdToDeps)
        return root
    })

    $depsForAllMutationResolution.watch((data) => console.log('depsForAllMutationResolution: ', data))
    $depsGraphForMutationResolution.watch((data) => console.log('depsGraphForMutationResolution: ', data))

    const initCheckCyclesEvent = createEvent('initCheckCyclesEvent')
    sample({
        source: $infoOfGraphMutationResolution,
        clock: [$infoOfGraphMutationResolution, initCheckCyclesEvent],
        filter: ({ hasCycle }) => hasCycle,
        fn: ({ cycles }) => ({
            id: genId(),
            message: `${getErrorMessage(errorCodes.circularDepDetected)} in $infoOfGraphMutationResolution. Deps: ${cycles.map((c) => c.join(' -> ')).join('; ')}`,
        }),
        target: appErrorsService.addErrorEvent,
    })
    initCheckCyclesEvent()

    return {
        $visabilityConditionsDeps,
        $componentsValidationsConditionsDeps,
        $groupsValidationsConditionsDeps,
        $viewsConditionsDeps,
        $viewsConditionsAllDeps,
        $depsTriggeringMutations,
        $infoOfGraphMutationResolution,
        $depsGraphForMutationResolution,
        $depsForAllMutationResolution,
    }
}
