import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty, splitAllSettledResult } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore } from 'effector'
import { isEmpty } from 'lodash-es'

import { SchemaMap } from '../../types'
import { GroupValidationRuleSchemas } from '../schema/types'
import { createGroupValidationModel } from './group-validation-model'
import { init } from './init'
import { createComponentSchemaModel, isValidableSchemaModel } from './models'
import { RunComponentValidationFxDone, RunComponentValidationFxFail } from './models/types'
import {
    CalcRelationRulesPayload,
    ComponentsSchemasService,
    ComponentsSchemasServiceParams,
    ComponentsValidationErrors,
    DepsRuleSchema,
    ReadyValidationsRules,
    RulesOverridesCache,
    UpdateComponentPropertiesPayload,
    UpdateComponentValidationErrorsPayload,
    UpdateGroupComponentsValidationErrorsPayload,
} from './types'
import {
    buildReverseDepsGraph,
    buildSortedDependents,
    extractDepsFromRuleSchemas,
    extractValidationsDeps,
    getDepsPathsOptionsBuilderRelationRules,
    getPermanentValidationsSchemas,
    topologicalSortDeps,
} from './utils'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService, schemaService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const initialComponentsSchemas = schemaService.$initialComponentsSchemas.getState()

    const $componentsValidationErrors = createStore<ComponentsValidationErrors>({})

    const $readyConditionalComponentsValidationRules = createStore<ReadyValidationsRules>({})
    const $readyConditionalGroupValidationRules = createStore<ReadyValidationsRules[keyof ReadyValidationsRules]>({
        readyBySchemaId: new Set(),
        readyGroupedByRuleName: {},
    })
    // TODO зачем? Убрать
    const $readyPermanentGroupValidationRules = combine(schemaService.$groupValidationSchemas, (groupValidationSchemas) => {
        const validationsList = Object.entries(groupValidationSchemas).map(([, schema]) => schema)
        return getPermanentValidationsSchemas(validationsList)
    })

    const $isComponentsValidationPending = createStore<boolean>(false)
    const $componentsIsValid = combine($componentsValidationErrors, (componentsValidationErrors) => isEmpty(Object.entries(componentsValidationErrors)))

    const $rulesOverridesCache = createStore<RulesOverridesCache>({})

    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const updateComponentValidationErrorsEvent = createEvent<UpdateComponentValidationErrorsPayload>('updateComponentValidationErrorsEvent')
    const updateGroupComponentsValidationErrorsPayload = createEvent<UpdateGroupComponentsValidationErrorsPayload>(
        'updateGroupComponentsValidationErrorsPayload',
    )
    const removeComponentValidationErrorsEvent = createEvent<{ componentId: EntityId }>('removeComponentValidationErrorsEvent')

    const runRelationRulesOnUserActionsEvent = createEvent<CalcRelationRulesPayload>('runRelationRulesOnUserActionsEvent')
    const $componentsSchemasModel = createStore<SchemaMap>(new Map())
    const buildComponentsSchemasModel = (data: ComponentsSchemas) => {
        const additionalTriggers = schemaService.$schema.getState().validations?.additionalTriggers || null

        return Object.entries(data).reduce<SchemaMap>((map, [componentId, componentSchema]) => {
            const model = createComponentSchemaModel({
                $componentsSchemasModel,
                $readyConditionalComponentsValidationRules,
                $componentsValidationErrors,
                schema: componentSchema,
                additionalTriggers,
                themeService,
                runRelationRulesEvent: runRelationRulesOnUserActionsEvent,
                updateComponentValidationErrorsEvent,
                removeComponentValidationErrorsEvent,
            })
            map.set(componentId, model)
            return map
        }, new Map())
    }
    const setComponentsSchemasModelEvent = createEvent<SchemaMap>()
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

    const setReadyConditionalComponentsValidationRulesEvent = createEvent<ReadyValidationsRules>('setReadyConditionalComponentsValidationRulesEvent')
    const setReadyConditionalGroupValidationRulesEvent = createEvent<ReadyValidationsRules[keyof ReadyValidationsRules]>(
        'setReadyConditionalGroupValidationRulesEvent',
    )

    const baseComponentsSchemasModelFx = createEffect<
        {
            componentsSchemasModel: SchemaMap
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
        mapParams: (componentsSchemasToUpdate: ComponentsSchemas, componentsSchemasModel: SchemaMap) => ({
            componentsSchemasModel,
            componentsSchemasToUpdate,
        }),
        effect: baseComponentsSchemasModelFx,
    })

    const baseRunComponentsValidationsFx = createEffect<SchemaMap, RunComponentValidationFxDone[], RunComponentValidationFxFail[]>(
        async (componentsSchemasModel) => {
            const promises = []

            for (const [, model] of componentsSchemasModel) {
                if (isValidableSchemaModel(model)) {
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
        $groupValidationErrors,
        $isValidationPending: $isGroupsValidationPending,
        validationIsAvailable: groupValidationIsAvailable,
    } = createGroupValidationModel({
        updateGroupComponentsValidationErrorsPayload,
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

    const $isValidationPending = combine(
        $isGroupsValidationPending,
        $isComponentsValidationPending,
        (groupsValidationPending, componentsValidationPending) => groupsValidationPending || componentsValidationPending,
    )

    $componentsValidationErrors.on(updateComponentValidationErrorsEvent, (curErrors, { componentId, errors }) => ({ ...curErrors, [componentId]: errors }))
    $componentsValidationErrors.on(updateGroupComponentsValidationErrorsPayload, (curErrors, { errors }) => {
        const newErrors = { ...curErrors }
        Object.entries(errors).forEach(([componentId, errors]) => {
            if (!(componentId in newErrors)) {
                newErrors[componentId] = []
            }
            newErrors[componentId].push(...errors)
        }, {})
        return newErrors
    })
    $componentsValidationErrors.on(removeComponentValidationErrorsEvent, (curErrors, { componentId }) => {
        delete curErrors[componentId]
        return { ...curErrors }
    })

    $isComponentsValidationPending.on(runComponentsValidationsFx, () => true)
    $isComponentsValidationPending.on(runComponentsValidationsFx.finally, () => false)

    $rulesOverridesCache.on(setRulesOverridesCacheEvent, (_, newCache) => newCache)

    $hiddenComponents.on(setHiddenComponentsEvent, (_, newComponentsToHidden) => newComponentsToHidden)

    $readyConditionalComponentsValidationRules.on(setReadyConditionalComponentsValidationRulesEvent, (_, newReadyRules) => newReadyRules)
    $readyConditionalGroupValidationRules.on(setReadyConditionalGroupValidationRulesEvent, (_, newReadyRules) => newReadyRules)

    init({
        schemaService,
        runRelationRulesOnUserActionsEvent,
        setRulesOverridesCacheEvent,
        setHiddenComponentsEvent,
        setReadyConditionalComponentsValidationRulesEvent,
        setReadyConditionalGroupValidationRulesEvent,
        initComponentSchemasEvent,
        updateComponentsSchemasModelFx,
        $hiddenComponents,
        $componentsSchemasModel,
        $rulesOverridesCache,
        $sortedAllRelationsDependents,
        $sortedRelationsDependentsByComponent,
        $depsComponentRuleSchemas,
        $depsGroupValidationRuleSchemas,
        $readyConditionalComponentsValidationRules,
        $readyConditionalGroupValidationRules,
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
        $schemasMap: $componentsSchemasModel,
        $isValidationPending,
        $groupValidationErrors,
        $componentsIsValid,
    }
}
