import { errorCodes, getErrorMessage } from '@form-crafter/core'
import { genId, isNotEmpty } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'

import { AppErrorsService } from '../../../app-errors'
import { GroupValidationRuleSchemas, SchemaService } from '../../../schema'
import { ThemeService } from '../../../theme'
import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'
import { DepsByMutationsRules } from './types'
import {
    buildFlattenGraphAndFindCycles,
    buildReverseDepsGraph,
    buildTopologicalSortedGraph,
    DepsByValidationsRules,
    extractComponentsMutationsDeps,
    extractComponentsValidationsConditionsDeps,
    extractValidationsSchemasConditionsDeps,
    extractViewsConditionsDeps,
    extractVisabilityConditionsDeps,
    filterDepsGraph,
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
    const $componentsValidationsConditionsDeps = createStore<DepsByValidationsRules>({ ruleIdToDepsComponentsIds: {}, componentIdToDependentsRuleIds: {} })
    const setComponentsValidationsConditionsDeps = createEvent<DepsByValidationsRules>('setComponentsValidationsConditionsDeps')
    $componentsValidationsConditionsDeps.on(setComponentsValidationsConditionsDeps, (_, newValue) => newValue)
    const $activeViewComponentsValidationsConditionsDeps = combine(
        $componentsValidationsConditionsDeps,
        viewsService.$currentViewComponents,
        (depsGraphs, viewComponents) => {
            const componentIdToDependentsRuleIds = Object.fromEntries(
                Object.entries(depsGraphs.componentIdToDependentsRuleIds).filter(([componentId]) => viewComponents.has(componentId)),
            )
            const ruleIdToDepsComponentsIds = Object.entries(depsGraphs.ruleIdToDepsComponentsIds).reduce<typeof depsGraphs.ruleIdToDepsComponentsIds>(
                (result, [ruleId, componentsIds]) => {
                    const finalComponentsIds = new Set(Array.from(componentsIds).filter((compId) => viewComponents.has(compId)))
                    if (isNotEmpty(finalComponentsIds)) {
                        result[ruleId] = finalComponentsIds
                    }
                    return result
                },
                {},
            )

            return {
                componentIdToDependentsRuleIds,
                ruleIdToDepsComponentsIds,
            }
        },
    )
    sample({
        source: { componentsSchemas: componentsModel.$componentsSchemas },
        clock: componentsModel.componentsAddedOrRemoved,
        fn: ({ componentsSchemas }) => extractComponentsValidationsConditionsDeps(componentsSchemas),
        target: setComponentsValidationsConditionsDeps,
    })

    const $componentsMutationsDeps = createStore<DepsByMutationsRules>({ componentIdToDeps: {}, componentIdToDependents: {} })
    const setComponentsMutationsDeps = createEvent<DepsByMutationsRules>('setComponentsMutationsDeps')
    $componentsMutationsDeps.on(setComponentsMutationsDeps, (_, newValue) => newValue)
    const $activeViewComponentsMutationsDeps = combine($componentsMutationsDeps, viewsService.$currentViewComponents, (depsGraphs, viewComponents) => ({
        componentIdToDeps: filterDepsGraph(depsGraphs.componentIdToDeps, viewComponents),
        componentIdToDependents: filterDepsGraph(depsGraphs.componentIdToDependents, viewComponents),
    }))
    sample({
        source: { componentsSchemas: componentsModel.$componentsSchemas, pathsToMutationsRulesDeps: themeService.$pathsToMutationsRulesDeps },
        clock: componentsModel.componentsAddedOrRemoved,
        fn: ({ componentsSchemas, pathsToMutationsRulesDeps }) => extractComponentsMutationsDeps(componentsSchemas, pathsToMutationsRulesDeps),
        target: setComponentsMutationsDeps,
    })

    const $visabilityConditionsDeps = createStore<DepsByMutationsRules>({ componentIdToDeps: {}, componentIdToDependents: {} })
    const setVisabilityConditionsDeps = createEvent<DepsByMutationsRules>('setVisabilityConditionsDeps')
    $visabilityConditionsDeps.on(setVisabilityConditionsDeps, (_, newValue) => newValue)
    const $activeViewVisabilityConditionsDeps = combine($visabilityConditionsDeps, viewsService.$currentViewComponents, (depsGraphs, viewComponents) => ({
        componentIdToDeps: filterDepsGraph(depsGraphs.componentIdToDeps, viewComponents),
        componentIdToDependents: filterDepsGraph(depsGraphs.componentIdToDependents, viewComponents),
    }))
    sample({
        source: { componentsSchemas: componentsModel.$componentsSchemas },
        clock: componentsModel.componentsAddedOrRemoved,
        fn: ({ componentsSchemas }) => extractVisabilityConditionsDeps(componentsSchemas),
        target: setVisabilityConditionsDeps,
    })

    const $groupsValidationsConditionsDeps = combine<GroupValidationRuleSchemas, DepsByValidationsRules>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const schemas = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const ruleIdToDepsComponentsIds = extractValidationsSchemasConditionsDeps(schemas)
            return { ruleIdToDepsComponentsIds, componentIdToDependentsRuleIds: buildReverseDepsGraph(ruleIdToDepsComponentsIds) }
        },
    )

    const $viewsConditionsDeps = combine(viewsService.$additionalsViewsArr, extractViewsConditionsDeps)
    const $viewsConditionsAllDeps = combine(
        $viewsConditionsDeps,
        (viewsConditionsDeps) => new Set(...Object.values(viewsConditionsDeps.viewIdToDepsComponents)),
    )

    const $activeViewDepsTriggeringMutations = combine(
        $activeViewComponentsMutationsDeps,
        $activeViewVisabilityConditionsDeps,
        (depsByMutation, depsByVisability) => ({
            componentIdToDeps: mergeDeps(depsByMutation.componentIdToDeps, depsByVisability.componentIdToDeps),
            componentIdToDependents: mergeDeps(depsByMutation.componentIdToDependents, depsByVisability.componentIdToDependents),
        }),
    )

    const $activeViewInfoOfGraphMutationsResolution = combine($activeViewDepsTriggeringMutations, ({ componentIdToDependents, componentIdToDeps }) => {
        const { flattenGraph, cycles, hasCycle } = buildFlattenGraphAndFindCycles(componentIdToDependents)
        const sortedGraphForResolution = buildTopologicalSortedGraph(flattenGraph, componentIdToDeps)

        return { cycles, hasCycle, sortedGraphForResolution, graph: componentIdToDependents }
    })
    const $activeViewDepsGraphForMutationsResolution = combine(
        $activeViewInfoOfGraphMutationsResolution,
        ({ sortedGraphForResolution }) => sortedGraphForResolution,
    )
    const $activeViewDepsForAllMutationsResolution = combine($activeViewDepsTriggeringMutations, ({ componentIdToDeps }) => {
        const dependentsGraph = { root: new Set(Object.keys(componentIdToDeps)) }
        const { root = [] } = buildTopologicalSortedGraph(dependentsGraph, componentIdToDeps)
        return root
    })

    const initCheckCycles = createEvent('initCheckCycles')
    sample({
        source: $activeViewInfoOfGraphMutationsResolution,
        clock: [$activeViewInfoOfGraphMutationsResolution, initCheckCycles],
        filter: ({ hasCycle }) => hasCycle,
        fn: ({ cycles }) => ({
            id: genId(),
            message: `${getErrorMessage(errorCodes.circularDepDetected)} in $infoOfGraphMutationsResolution. Deps: ${cycles.map((c) => c.join(' -> ')).join('; ')}`,
        }),
        target: appErrorsService.addError,
    })
    initCheckCycles()

    return {
        $activeViewComponentsValidationsConditionsDeps,
        $groupsValidationsConditionsDeps,
        $viewsConditionsDeps,
        $viewsConditionsAllDeps,
        $activeViewInfoOfGraphMutationsResolution,
        $activeViewDepsGraphForMutationsResolution,
        $activeViewDepsForAllMutationsResolution,
    }
}
