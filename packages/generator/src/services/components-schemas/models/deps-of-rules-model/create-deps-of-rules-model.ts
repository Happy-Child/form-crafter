import { errorCodes, getErrorMessage } from '@form-crafter/core'
import { genId } from '@form-crafter/utils'
import { combine, createEvent, sample } from 'effector'

import { AppErrorsService } from '../../../app-errors'
import { SchemaService } from '../../../schema'
import { GroupValidationRuleSchemas } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'
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
    appErrorsService: AppErrorsService
    themeService: ThemeService
    viewsService: ViewsService
    schemaService: SchemaService
    componentsModel: ComponentsModel
}

export type DepsOfRulesModel = ReturnType<typeof createDepsOfRulesModel>

export const createDepsOfRulesModel = ({ appErrorsService, themeService, viewsService, schemaService, componentsModel }: Params) => {
    const $componentsValidationsConditionsDeps = combine(componentsModel.$viewComponentsSchemas, extractComponentsValidationsConditionsDeps)

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
        (viewsConditionsDeps) => new Set(...Object.values(viewsConditionsDeps.viewIdToDepsComponents)),
    )

    const $componentsMutationsDeps = combine(
        componentsModel.$viewComponentsSchemas,
        themeService.$pathsToMutationsRulesDeps,
        (componentsSchemas, pathsToDeps) => extractComponentsMutationsDeps(componentsSchemas, pathsToDeps),
    )
    const $visabilityConditionsDeps = combine(componentsModel.$viewComponentsSchemas, extractVisabilityConditionsDeps)
    const $depsTriggeringMutations = combine($componentsMutationsDeps, $visabilityConditionsDeps, (depsByMutation, depsByVisability) => ({
        componentIdToDeps: mergeDeps(depsByMutation.componentIdToDeps, depsByVisability.componentIdToDeps),
        componentIdToDependents: mergeDeps(depsByMutation.componentIdToDependents, depsByVisability.componentIdToDependents),
    }))

    const $infoOfGraphMutationsResolution = combine($depsTriggeringMutations, ({ componentIdToDependents, componentIdToDeps }) => {
        const { flattenGraph, cycles, hasCycle } = buildFlattenGraphAndFindCycles(componentIdToDependents)
        const sortedGraphForResolution = buildTopologicalSortedGraph(flattenGraph, componentIdToDeps)

        return { cycles, hasCycle, sortedGraphForResolution, graph: componentIdToDependents }
    })
    const $depsGraphForMutationsResolution = combine($infoOfGraphMutationsResolution, ({ sortedGraphForResolution }) => sortedGraphForResolution)
    const $depsForAllMutationsResolution = combine($depsTriggeringMutations, ({ componentIdToDeps }) => {
        const dependentsGraph = { root: new Set(Object.keys(componentIdToDeps)) }
        const { root } = buildTopologicalSortedGraph(dependentsGraph, componentIdToDeps)
        return root
    })

    const resultOfBuildingGraphsDeps = sample({
        clock: componentsModel.componentsAddedOrRemoved,
        fn: () => {},
    })

    // sample({
    //     clock: resultOfBuildingGraphsDeps,
    //     fn: ({ a }) => a,
    //     target: b,
    // })

    // sample({
    //     clock: resultOfBuildingGraphsDeps,
    //     fn: ({ a }) => a,
    //     target: b,
    // })

    // sample({
    //     clock: resultOfBuildingGraphsDeps,
    //     fn: ({ a }) => a,
    //     target: b,
    // })

    const initCheckCyclesEvent = createEvent('initCheckCyclesEvent')
    sample({
        source: $infoOfGraphMutationsResolution,
        clock: [$infoOfGraphMutationsResolution, initCheckCyclesEvent],
        filter: ({ hasCycle }) => hasCycle,
        fn: ({ cycles }) => ({
            id: genId(),
            message: `${getErrorMessage(errorCodes.circularDepDetected)} in $infoOfGraphMutationsResolution. Deps: ${cycles.map((c) => c.join(' -> ')).join('; ')}`,
        }),
        target: appErrorsService.addErrorEvent,
    })
    initCheckCyclesEvent()

    $componentsValidationsConditionsDeps.watch((da) => console.log('componentsValidationsConditionsDeps: ', da))
    $depsGraphForMutationsResolution.watch((da) => console.log('depsGraphForMutationsResolution: ', da))
    $depsForAllMutationsResolution.watch((da) => console.log('depsForAllMutationsResolution: ', da))

    return {
        $componentsValidationsConditionsDeps,
        $groupsValidationsConditionsDeps,
        $viewsConditionsDeps,
        $viewsConditionsAllDeps,
        $infoOfGraphMutationsResolution,
        $depsGraphForMutationsResolution,
        $depsForAllMutationsResolution,
    }
}
