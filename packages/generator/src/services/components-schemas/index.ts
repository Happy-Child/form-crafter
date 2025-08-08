import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { differenceSet, isNotEmpty, splitAllSettledResult } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, sample, UnitValue } from 'effector'
import { isEmpty } from 'lodash-es'

import { GroupValidationRuleSchemas } from '../schema/types'
import {
    ComponentsModels,
    createComponentModel,
    extractComponentsModels,
    isValidableModel,
    type RunComponentValidationFxDone,
    type RunComponentValidationFxFail,
} from './components-models'
import { createGroupValidationModel } from './group-validation-model'
import { init } from './init'
import {
    CalcRelationRulesPayload,
    ComponentsSchemasService,
    ComponentsSchemasServiceParams,
    DepsRuleSchema,
    GetExecutorContextBuilder,
    ReadyValidationsRules,
    ReadyValidationsRulesByRuleName,
    RulesOverridesCache,
    UpdateComponentPropertiesPayload,
} from './types'
import {
    buildExecutorContext,
    buildReverseDepsGraph,
    buildSortedDependents,
    extractDepsFromRuleSchemas,
    extractValidationsDeps,
    getDepsPathsOptionsBuilderRelationRules,
    removeReadyValidationRules,
    topologicalSortDeps,
} from './utils'
import { createValidationsErrorsModel } from './validations-errors-model'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService, schemaService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const initialComponentsSchemas = schemaService.$initialComponentsSchemas.getState()
    const additionalTriggers = schemaService.$schema.getState().validations?.additionalTriggers || null

    const $readyConditionalValidationRules = createStore<ReadyValidationsRules>({})
    const $readyConditionalValidationRulesByRuleName = createStore<ReadyValidationsRulesByRuleName>({})
    const $readyConditionalValidationRulesIds = combine($readyConditionalValidationRules, (readyRules) =>
        Object.entries(readyRules).reduce<ReadyValidationsRules[keyof ReadyValidationsRules]>(
            (result, [, readyRulesIds]) => new Set([...result, ...readyRulesIds]),
            new Set(),
        ),
    )

    const $readyConditionalGroupValidationRules = createStore<ReadyValidationsRules[keyof ReadyValidationsRules]>(new Set())
    const $readyConditionalGroupValidationRulesByRuleName = createStore<ReadyValidationsRulesByRuleName[keyof ReadyValidationsRulesByRuleName]>({})

    const $isComponentsValidationPending = createStore<boolean>(false)

    const $rulesOverridesCache = createStore<RulesOverridesCache>({})

    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const {
        setComponentValidationErrorsEvent,
        setComponentsGroupsValidationErrorsEvent,
        removeComponentValidationErrorsEvent,
        removeAllValidationErrorsEvent,
        filterAllValidationErrorsEvent,
        clearComponentsGroupsValidationErrorsEvent,
        $componentsGroupsValidationErrors,
        $visibleValidationErrors,
    } = createValidationsErrorsModel({ $hiddenComponents })

    const runRelationRulesOnUserActionsEvent = createEvent<CalcRelationRulesPayload>('runRelationRulesOnUserActionsEvent')
    const $componentsModels = createStore<ComponentsModels>(new Map())
    const $componentsSchemas = combine($componentsModels, extractComponentsModels)
    const $visibleComponentsSchemas = combine($componentsSchemas, $hiddenComponents, (componentsSchemas, hiddenComponents) => {
        const result = { ...componentsSchemas }
        hiddenComponents.forEach((componentId) => {
            delete result[componentId]
        })
        return result
    })
    const $visibleComponentsIds = combine($visibleComponentsSchemas, (visibleComponentsSchemas) => Object.keys(visibleComponentsSchemas))
    const $componentsIdsCanBeValidate = combine($visibleComponentsSchemas, (visibleComponentsSchemas) =>
        Object.entries(visibleComponentsSchemas).reduce<Set<EntityId>>((result, [componentId, schema]) => {
            if (isNotEmpty(schema.validations?.schemas)) {
                result.add(componentId)
            }
            return result
        }, new Set()),
    )

    const $getExecutorContextBuilder: GetExecutorContextBuilder = combine<UnitValue<typeof $componentsSchemas>, UnitValue<GetExecutorContextBuilder>>(
        $componentsSchemas,
        (componentsSchemas) => {
            return (params) => buildExecutorContext({ componentsSchemas: params?.componentsSchemas || componentsSchemas })
        },
    )

    const buildComponentsModels = (data: ComponentsSchemas) => {
        return Object.entries(data).reduce<ComponentsModels>((map, [componentId, componentSchema]) => {
            const model = createComponentModel({
                $componentsSchemas,
                $getExecutorContextBuilder,
                $readyConditionalValidationRules,
                $readyConditionalValidationRulesByRuleName,
                $visibleValidationErrors,
                schema: componentSchema,
                additionalTriggers,
                themeService,
                runRelationRulesEvent: runRelationRulesOnUserActionsEvent,
                setComponentValidationErrorsEvent,
                removeComponentValidationErrorsEvent,
                removeAllValidationErrorsEvent,
            })
            map.set(componentId, model)
            return map
        }, new Map())
    }
    const setComponentsModelsEvent = createEvent<ComponentsModels>()
    $componentsModels.on(setComponentsModelsEvent, (_, data) => data)
    setComponentsModelsEvent(buildComponentsModels(initial))

    const baseComponentsModelsFx = createEffect<
        {
            componentsModels: ComponentsModels
            componentsSchemasToUpdate: ComponentsSchemas
        },
        ComponentsModels
    >(({ componentsModels, componentsSchemasToUpdate }) => {
        const newModel = Object.entries(componentsSchemasToUpdate).reduce((map, [componentId, schema]) => {
            const model = map.get(componentId)
            if (isNotEmpty(model)) {
                model.setSchemaEvent(schema)
            }
            return map
        }, new Map(componentsModels))

        return Promise.resolve(newModel)
    })
    const updateComponentsModelsFx = attach({
        source: $componentsModels,
        mapParams: (componentsSchemasToUpdate: ComponentsSchemas, componentsModels: ComponentsModels) => ({
            componentsModels,
            componentsSchemasToUpdate,
        }),
        effect: baseComponentsModelsFx,
    })

    sample({
        clock: updateComponentsModelsFx.doneData,
        target: setComponentsModelsEvent,
    })

    // TODO move in componentsDepsFromRuleSchemas?
    const $depsPathsOptiondsBuilderRelationRules = combine(themeService.$relationRules, getDepsPathsOptionsBuilderRelationRules)
    const $depsComponentsRuleSchemas = combine($depsPathsOptiondsBuilderRelationRules, (depsPaths) =>
        extractDepsFromRuleSchemas(initialComponentsSchemas, depsPaths),
    )
    const $depsGroupsValidationRuleSchemas = combine<GroupValidationRuleSchemas, DepsRuleSchema>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const validationsList = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const depsGraph = extractValidationsDeps(validationsList)
            return { schemaIdToDeps: depsGraph, schemaIdToDependents: buildReverseDepsGraph(depsGraph) }
        },
    )

    const $sortedAllRelationsDependents = combine($depsComponentsRuleSchemas, ({ relations: { schemaIdToDeps } }) => {
        const componentsIdWithRelationsRules = Object.keys(schemaIdToDeps)
        return topologicalSortDeps(componentsIdWithRelationsRules, schemaIdToDeps)
    })
    const $sortedRelationsDependentsByComponent = combine($depsComponentsRuleSchemas, ({ relations: { schemaIdToDeps, schemaIdToDependents } }) =>
        buildSortedDependents(schemaIdToDeps, schemaIdToDependents),
    )

    const initServiceEvent = createEvent('initServiceEvent')

    const setRulesOverridesCacheEvent = createEvent<RulesOverridesCache>('setRulesOverridesCacheEvent')

    const setHiddenComponentsEvent = createEvent<Set<EntityId>>('setHiddenComponentsEvent')

    const setReadyConditionalValidationRulesEvent = createEvent<UnitValue<typeof $readyConditionalValidationRules>>('setReadyConditionalValidationRulesEvent')
    const setReadyConditionalValidationRulesByRuleNameEvent = createEvent<UnitValue<typeof $readyConditionalValidationRulesByRuleName>>(
        'setReadyConditionalValidationRulesByRuleNameEvent',
    )
    const removeReadyConditionalValidationRulesEvent = createEvent<Set<EntityId>>('removeReadyConditionalValidationRulesEvent')
    const removeReadyConditionalValidationRulesByRuleNameEvent = createEvent<Set<EntityId>>('removeReadyConditionalValidationRulesByRuleNameEvent')

    const setReadyConditionalGroupValidationRulesEvent = createEvent<UnitValue<typeof $readyConditionalGroupValidationRules>>(
        'setReadyConditionalGroupValidationRulesEvent',
    )
    const setReadyConditionalGroupValidationRulesByRuleNameEvent = createEvent<UnitValue<typeof $readyConditionalGroupValidationRulesByRuleName>>(
        'setReadyConditionalGroupValidationRulesEvent',
    )
    const removeReadyConditionalGroupValidationRulesEvent = createEvent<Set<EntityId>>('removeReadyConditionalGroupValidationRulesEvent')
    const removeReadyConditionalGroupValidationRulesByRuleNameEvent = createEvent<Set<EntityId>>('removeReadyConditionalGroupValidationRulesByRuleNameEvent')

    const baseRunComponentsValidationsFx = createEffect<
        { componentsModels: UnitValue<typeof $componentsModels>; componentsIdsCanBeValidate: UnitValue<typeof $componentsIdsCanBeValidate> },
        RunComponentValidationFxDone[],
        RunComponentValidationFxFail[]
    >(async ({ componentsModels, componentsIdsCanBeValidate }) => {
        const promises = []

        for (const componentId of componentsIdsCanBeValidate) {
            const model = componentsModels.get(componentId)
            if (isNotEmpty(model) && isValidableModel(model)) {
                promises.push(model.runValidationFx())
            }
        }

        const [resolved, rejected] = await splitAllSettledResult<RunComponentValidationFxDone, RunComponentValidationFxFail>(promises)
        if (isNotEmpty(rejected)) {
            return Promise.reject(rejected)
        }

        return Promise.resolve(resolved)
    })
    const runComponentsValidationsFx = attach({
        source: { componentsModels: $componentsModels, componentsIdsCanBeValidate: $componentsIdsCanBeValidate },
        effect: baseRunComponentsValidationsFx,
    })

    const {
        runGroupValidationsFx,
        filterErrorsEvent: filterGroupsValidationErrorsEvent,
        $errors: $groupValidationErrors,
        $isValidationPending: $isGroupsValidationPending,
    } = createGroupValidationModel({
        setComponentsGroupsValidationErrorsEvent,
        clearComponentsGroupsValidationErrorsEvent,
        $componentsGroupsValidationErrors,
        $getExecutorContextBuilder,
        $groupValidationRules: themeService.$groupValidationRules,
        $groupValidationSchemas: schemaService.$groupValidationSchemas,
        $readyConditionalGroupValidationRules,
    })

    const runFormValidationFx = createEffect(async () => {
        let someoneFailed = false

        try {
            await runComponentsValidationsFx()
        } catch {
            someoneFailed = true
        }

        try {
            await runGroupValidationsFx()
        } catch {
            someoneFailed = true
        }

        if (someoneFailed) {
            return Promise.reject()
        }

        return Promise.resolve()
    })

    const $groupValidationErrorsArr = combine($groupValidationErrors, (groupValidationErrors) => Array.from(groupValidationErrors.values()))

    const $formIsValid = combine(
        $visibleValidationErrors,
        $groupValidationErrors,
        (visibleValidationErrors, groupValidationErrors) => isEmpty(visibleValidationErrors) && isEmpty(groupValidationErrors),
    )

    const $isValidationPending = combine(
        $isGroupsValidationPending,
        $isComponentsValidationPending,
        (groupsValidationPending, componentsValidationPending) => groupsValidationPending || componentsValidationPending,
    )

    $isComponentsValidationPending.on(runComponentsValidationsFx, () => true)
    $isComponentsValidationPending.on(runComponentsValidationsFx.finally, () => false)

    $rulesOverridesCache.on(setRulesOverridesCacheEvent, (_, newCache) => newCache)

    $hiddenComponents.on(setHiddenComponentsEvent, (_, newComponentsToHidden) => newComponentsToHidden)

    $readyConditionalValidationRules.on(setReadyConditionalValidationRulesEvent, (_, readyRules) => readyRules)
    $readyConditionalValidationRulesByRuleName.on(setReadyConditionalValidationRulesByRuleNameEvent, (_, readyRules) => readyRules)

    $readyConditionalValidationRules.on(removeReadyConditionalValidationRulesEvent, removeReadyValidationRules)
    $readyConditionalValidationRulesByRuleName.on(removeReadyConditionalValidationRulesByRuleNameEvent, (curReadyRules, rulesIdsToRemove) => {
        const result = Object.entries(curReadyRules).reduce<UnitValue<typeof $readyConditionalValidationRulesByRuleName>>(
            (curRedyRules, [componentId, readyRules]) => {
                const updatedReadyRules = removeReadyValidationRules(readyRules, rulesIdsToRemove)
                if (isEmpty(updatedReadyRules)) {
                    delete curRedyRules[componentId]
                } else {
                    curRedyRules[componentId] = updatedReadyRules
                }
                return curReadyRules
            },
            {},
        )
        return { ...result }
    })

    $readyConditionalGroupValidationRules.on(setReadyConditionalGroupValidationRulesEvent, (_, readyRules) => readyRules)
    $readyConditionalGroupValidationRulesByRuleName.on(setReadyConditionalGroupValidationRulesByRuleNameEvent, (_, readyRules) => readyRules)

    $readyConditionalGroupValidationRules.on(removeReadyConditionalGroupValidationRulesEvent, differenceSet)
    $readyConditionalGroupValidationRulesByRuleName.on(removeReadyConditionalGroupValidationRulesByRuleNameEvent, removeReadyValidationRules)

    init({
        schemaService,
        runRelationRulesOnUserActionsEvent,
        setRulesOverridesCacheEvent,
        setHiddenComponentsEvent,
        setReadyConditionalValidationRulesEvent,
        setReadyConditionalValidationRulesByRuleNameEvent,
        setReadyConditionalGroupValidationRulesEvent,
        setReadyConditionalGroupValidationRulesByRuleNameEvent,
        initServiceEvent,
        filterAllValidationErrorsEvent,
        filterGroupsValidationErrorsEvent,
        updateComponentsModelsFx,
        $hiddenComponents,
        $componentsSchemas,
        $rulesOverridesCache,
        $sortedAllRelationsDependents,
        $sortedRelationsDependentsByComponent,
        $depsComponentsRuleSchemas,
        $depsGroupsValidationRuleSchemas,
        $readyConditionalValidationRules,
        $readyConditionalValidationRulesByRuleName,
        $readyConditionalValidationRulesIds,
        $readyConditionalGroupValidationRules,
        $readyConditionalGroupValidationRulesByRuleName,
        $operatorsForConditions: themeService.$operatorsForConditions,
        $relationRules: themeService.$relationRules,
        $getExecutorContextBuilder,
    })

    console.log('depsPathsOptiondsBuilderRelationRules: ', $depsPathsOptiondsBuilderRelationRules.getState())
    console.log('sortedRelationsDependentsByComponent: ', $sortedRelationsDependentsByComponent.getState())
    console.log('sortedAllRelationsDependents: ', $sortedAllRelationsDependents.getState())

    // OLD BEGIN
    const updateComponentsSchemasEvent = createEvent<ComponentsSchemas>('updateComponentsSchemasEvent')
    const removeComponentsSchemasByIdsEvent = createEvent<{ ids: EntityId[] }>('removeComponentsSchemasByIdsEvent')
    const updateComponentPropertiesEvent = createEvent<UpdateComponentPropertiesPayload>('updateComponentPropertiesEvent')

    // $schemas
    //     .on(updateComponentsSchemasEvent, (curData, data) => ({
    //         ...curData,
    //         ...data,
    //     }))
    //     .on(removeComponentsSchemasByIdsEvent, (curData, { ids }) =>
    //         Object.fromEntries(Object.entries(curData).filter(([componentId]) => !ids.includes(componentId))),
    //     )

    // $schemas.on(updateComponentPropertiesEvent, (curData, { id, data }) => ({
    //     ...curData,
    //     [id]: {
    //         ...curData[id],
    //         properties: {
    //             ...curData[id].properties,
    //             ...data,
    //         },
    //     },
    // }))
    // OLD END

    return {
        runFormValidationFx,
        updateComponentsSchemasEvent,
        updateComponentPropertiesEvent,
        removeComponentsSchemasByIdsEvent,
        initServiceEvent,
        $componentsModels,
        $visibleComponentsSchemas,
        $isValidationPending,
        $groupValidationErrors: $groupValidationErrorsArr,
        $formIsValid,
    }
}
