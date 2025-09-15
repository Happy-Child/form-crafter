import { ComponentsSchemas, errorCodes, getErrorMessage } from '@form-crafter/core'
import { genId } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'

import { AppErrorsService } from '../../../app-errors'
import { SchemaService } from '../../../schema'
import { GroupValidationRuleSchemas } from '../../../schema'
import { ThemeService } from '../../../theme'
import { DepsByValidationRules } from './types'
import {
    buildFlattenGraphAndFindCycles,
    buildReverseDepsGraph,
    buildTopologicalSortedGraph,
    extractComponentsMutationsDeps,
    extractComponentsValidationsConditionsDeps,
    extractComponentsVisabilityConditionsDeps,
    extractValidationsSchemasConditionsDeps,
    mergeDeps,
} from './utils'

type Params = {
    themeService: ThemeService
    schemaService: SchemaService
    initialComponentsSchemas: ComponentsSchemas
    appErrorsService: AppErrorsService
}

export type DepsOfRulesModel = ReturnType<typeof createDepsOfRulesModel>

export const createDepsOfRulesModel = ({ initialComponentsSchemas, themeService, schemaService, appErrorsService }: Params) => {
    const $componentsMutationsDeps = combine(themeService.$pathsToMutationsRulesDeps, (pathsToDeps) =>
        extractComponentsMutationsDeps(initialComponentsSchemas, pathsToDeps),
    )

    const $componentsVisabilityConditionsDeps = createStore(extractComponentsVisabilityConditionsDeps(initialComponentsSchemas))

    const $componentsValidationsConditionsDeps = createStore(extractComponentsValidationsConditionsDeps(initialComponentsSchemas))

    const $depsTriggeringMutations = combine($componentsMutationsDeps, $componentsVisabilityConditionsDeps, (depsByMutation, depsByVisability) => ({
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

    const $groupsValidationsDeps = combine<GroupValidationRuleSchemas, DepsByValidationRules>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const schemas = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const ruleIdToDepsComponents = extractValidationsSchemasConditionsDeps(schemas)
            return { ruleIdToDepsComponents, componentsToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponents) }
        },
    )

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
        $depsTriggeringMutations,
        $infoOfGraphMutationResolution,
        $depsGraphForMutationResolution,
        $depsForAllMutationResolution,
        $groupsValidationsDeps,
        $componentsValidationsConditionsDeps,
        $componentsVisabilityConditionsDeps,
    }
}
