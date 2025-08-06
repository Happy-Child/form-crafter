import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { differenceSet, isNotEmpty, splitAllSettledResult } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, UnitValue } from 'effector'
import { isEmpty } from 'lodash-es'

import { GroupValidationRuleSchemas } from '../schema/types'
import {
    canBeValidateSchemaModel,
    ComponentsSchemasModel,
    createComponentSchemaModel,
    isValidableSchemaModel,
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
    ReadyValidationsRules,
    ReadyValidationsRulesByRuleName,
    RulesOverridesCache,
    UpdateComponentPropertiesPayload,
} from './types'
import {
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

    const {
        setComponentValidationErrorsEvent,
        setComponentsGroupsValidationErrorsEvent,
        removeValidationErrorsEvent,
        filterValidationErrorsEvent,
        clearComponentsGroupsValidationErrorsEvent,
        $componentsGroupsValidationErrors,
        $componentsValidationErrors,
        $validationErrors,
    } = createValidationsErrorsModel()

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

    const runRelationRulesOnUserActionsEvent = createEvent<CalcRelationRulesPayload>('runRelationRulesOnUserActionsEvent')
    const $componentsSchemasModel = createStore<ComponentsSchemasModel>(new Map())
    const buildComponentsSchemasModel = (data: ComponentsSchemas) => {
        const additionalTriggers = schemaService.$schema.getState().validations?.additionalTriggers || null

        return Object.entries(data).reduce<ComponentsSchemasModel>((map, [componentId, componentSchema]) => {
            const model = createComponentSchemaModel({
                $componentsSchemasModel,
                $readyConditionalValidationRules,
                $readyConditionalValidationRulesByRuleName,
                $validationErrors,
                schema: componentSchema,
                additionalTriggers,
                themeService,
                runRelationRulesEvent: runRelationRulesOnUserActionsEvent,
                setComponentValidationErrorsEvent,
                removeValidationErrorsEvent,
            })
            map.set(componentId, model)
            return map
        }, new Map())
    }
    const setComponentsSchemasModelEvent = createEvent<ComponentsSchemasModel>()
    $componentsSchemasModel.on(setComponentsSchemasModelEvent, (_, data) => data)
    setComponentsSchemasModelEvent(buildComponentsSchemasModel(initial))

    // TODO move in componentsDepsFromRuleSchemas?
    const $depsPathsOptiondsBuilderRelationRules = combine(themeService.$relationRules, getDepsPathsOptionsBuilderRelationRules)
    const $depsComponentRuleSchemas = combine($depsPathsOptiondsBuilderRelationRules, (depsPaths) =>
        extractDepsFromRuleSchemas(initialComponentsSchemas, depsPaths),
    )
    const $depsGroupValidationRuleSchemas = combine<GroupValidationRuleSchemas, DepsRuleSchema>(
        schemaService.$groupValidationSchemas,
        (groupValidationSchemas) => {
            const validationsList = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
            const depsGraph = extractValidationsDeps(validationsList)
            return { schemaIdToDeps: depsGraph, schemaIdToDependents: buildReverseDepsGraph(depsGraph) }
        },
    )

    const $sortedAllRelationsDependents = combine($depsComponentRuleSchemas, ({ relations: { schemaIdToDeps } }) => {
        const componentsIdWithRelationsRules = Object.keys(schemaIdToDeps)
        return topologicalSortDeps(componentsIdWithRelationsRules, schemaIdToDeps)
    })
    const $sortedRelationsDependentsByComponent = combine($depsComponentRuleSchemas, ({ relations: { schemaIdToDeps, schemaIdToDependents } }) =>
        buildSortedDependents(schemaIdToDeps, schemaIdToDependents),
    )

    const initComponentSchemasEvent = createEvent('initComponentSchemasEvent')

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

    const baseComponentsSchemasModelFx = createEffect<
        {
            componentsSchemasModel: ComponentsSchemasModel
            componentsSchemasToUpdate: ComponentsSchemas
        },
        void
    >(({ componentsSchemasModel, componentsSchemasToUpdate }) => {
        Object.entries(componentsSchemasToUpdate).reduce((map, [componentId, schema]) => {
            const model = map.get(componentId)
            if (isNotEmpty(model)) {
                model.setSchemaEvent(schema)
            }
            return map
        }, new Map(componentsSchemasModel))
    })
    const updateComponentsSchemasModelFx = attach({
        source: $componentsSchemasModel,
        mapParams: (componentsSchemasToUpdate: ComponentsSchemas, componentsSchemasModel: ComponentsSchemasModel) => ({
            componentsSchemasModel,
            componentsSchemasToUpdate,
        }),
        effect: baseComponentsSchemasModelFx,
    })

    const baseRunComponentsValidationsFx = createEffect<ComponentsSchemasModel, RunComponentValidationFxDone[], RunComponentValidationFxFail[]>(
        async (componentsSchemasModel) => {
            const promises = []

            for (const [, model] of componentsSchemasModel) {
                if (isValidableSchemaModel(model) && canBeValidateSchemaModel(model)) {
                    promises.push(model.runValidationFx())
                }
            }

            const [resolved, rejected] = await splitAllSettledResult<RunComponentValidationFxDone, RunComponentValidationFxFail>(promises)
            if (isNotEmpty(rejected)) {
                return Promise.reject(rejected)
            }

            return Promise.resolve(resolved)
        },
    )
    const runComponentsValidationsFx = attach({
        source: $componentsSchemasModel,
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
        $componentsSchemasModel,
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
        $componentsGroupsValidationErrors,
        $componentsValidationErrors,
        $groupValidationErrors,
        (componentsGroupsValidationErrors, componentsValidationErrors, groupValidationErrors) =>
            isEmpty(Object.entries(componentsValidationErrors)) && isEmpty(Object.entries(componentsGroupsValidationErrors)) && isEmpty(groupValidationErrors),
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
        initComponentSchemasEvent,
        filterValidationErrorsEvent,
        filterGroupsValidationErrorsEvent,
        updateComponentsSchemasModelFx,
        $hiddenComponents,
        $componentsSchemasModel,
        $rulesOverridesCache,
        $sortedAllRelationsDependents,
        $sortedRelationsDependentsByComponent,
        $depsComponentRuleSchemas,
        $depsGroupValidationRuleSchemas,
        $readyConditionalValidationRules,
        $readyConditionalValidationRulesByRuleName,
        $readyConditionalValidationRulesIds,
        $readyConditionalGroupValidationRules,
        $readyConditionalGroupValidationRulesByRuleName,
        $operatorsForConditions: themeService.$operatorsForConditions,
        $relationRules: themeService.$relationRules,
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
        initComponentSchemasEvent,
        $componentsSchemasModel,
        $isValidationPending,
        $groupValidationErrors: $groupValidationErrorsArr,
        $formIsValid,
    }
}
