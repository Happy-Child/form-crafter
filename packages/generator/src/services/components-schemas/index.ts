import { ComponentsSchemas, ComponentValidationError, EntityId } from '@form-crafter/core'
import { isNotEmpty, splitAllSettledResult } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore } from 'effector'
import { isEmpty } from 'lodash-es'

import { SchemaMap } from '../../types'
import { init } from './init'
import { componentSchemaModel, isValidableSchemaModel } from './models'
import { RunValidationFxDone, RunValidationFxFail } from './models/types'
import {
    CalcRelationsRulesPayload,
    ComponentsSchemasService,
    ComponentsSchemasServiceParams,
    ComponentsValidationErrors,
    ReadyValidationsRules,
    RulesOverridesCache,
    UpdateComponentPropertiesPayload,
    ValidationRuleSchemas,
} from './types'
import { buildSortedDependents, extractDepsFromSchema, getDepsPathsOptiondsBuilderRelationsRules, topologicalSortDeps } from './utils'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService, schemaService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const $initialComponentsSchemas = createStore<ComponentsSchemas>(initial)

    const updateComponentsValidationErrorsEvent = createEvent<{ componentId: EntityId; errors: ComponentValidationError[] }>(
        'updateComponentsValidationErrorsEvent',
    )
    const removeComponentValidationErrorsEvent = createEvent<{ componentId: EntityId }>('removeComponentValidationErrorsEvent')
    const $componentsValidationErrors = createStore<ComponentsValidationErrors>({})

    const $readyConditionalValidationsRules = createStore<ReadyValidationsRules>({})

    const $isValidationComponentsPending = createStore<boolean>(false)

    const $componentsIsValid = combine($componentsValidationErrors, (componentsValidationErrors) => isEmpty(Object.entries(componentsValidationErrors)))

    const $validationRuleSchemas = combine($initialComponentsSchemas, (componentsSchemas) =>
        Object.entries(componentsSchemas).reduce<ValidationRuleSchemas>((map, [ownerComponentId, componentSchema]) => {
            componentSchema?.validations?.options.forEach((validationSchema) => {
                map[validationSchema.id] = {
                    ownerComponentId,
                    schema: validationSchema,
                }
            })
            return map
        }, {}),
    )

    const runRelationsRulesOnUserActionsEvent = createEvent<CalcRelationsRulesPayload>('calcRelationsRulesEvent')
    const $componentsSchemasModel = createStore<SchemaMap>(new Map())
    const buildComponentsSchemasModel = (data: ComponentsSchemas) => {
        const additionalTriggers = schemaService.$schema.getState().validations?.additionalTriggers || null

        return Object.entries(data).reduce<SchemaMap>((map, [componentId, componentSchema]) => {
            const model = componentSchemaModel({
                $componentsSchemasModel,
                $readyConditionalValidationsRules,
                $componentsValidationErrors,
                schema: componentSchema,
                additionalTriggers,
                themeService,
                runRelationsRulesEvent: runRelationsRulesOnUserActionsEvent,
                updateComponentsValidationErrorsEvent,
                removeComponentValidationErrorsEvent,
            })
            map.set(componentId, model)
            return map
        }, new Map())
    }
    const setComponentsSchemasModelEvent = createEvent<SchemaMap>()
    $componentsSchemasModel.on(setComponentsSchemasModelEvent, (_, data) => data)
    setComponentsSchemasModelEvent(buildComponentsSchemasModel(initial))

    const $depsPathsOptiondsBuilderRelationsRules = combine(themeService.$relationsRules, getDepsPathsOptiondsBuilderRelationsRules)
    const $rulesDepsFromSchema = combine($initialComponentsSchemas, $depsPathsOptiondsBuilderRelationsRules, extractDepsFromSchema)

    const $sortedRelationsDependents = combine($rulesDepsFromSchema, ({ relations: { entityIdToDeps } }) => {
        const componentsIdWithRelationsRules = Object.keys(entityIdToDeps)
        return topologicalSortDeps(componentsIdWithRelationsRules, entityIdToDeps)
    })
    const $sortedRelationsDependentsByComponent = combine($rulesDepsFromSchema, ({ relations: { entityIdToDeps, entityIdToDependents } }) =>
        buildSortedDependents(entityIdToDeps, entityIdToDependents),
    )

    const $rulesOverridesCache = createStore<RulesOverridesCache>({})

    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const initComponentSchemasEvent = createEvent('initComponentSchemasEvent')

    const setRulesOverridesCacheEvent = createEvent<RulesOverridesCache>('setRulesOverridesCacheEvent')

    const setHiddenComponentsEvent = createEvent<Set<EntityId>>('setHiddenComponentsEvent')

    const setReadyConditionalValidationsRulesEvent = createEvent<ReadyValidationsRules>('setReadyConditionalValidationsRulesEvent')

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
                model.setModelEvent(schema)
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

    const baseRunValidationAllComponentsFx = createEffect<SchemaMap, RunValidationFxDone[], RunValidationFxFail[]>(async (componentsSchemasModel) => {
        const promises = []

        for (const [, model] of componentsSchemasModel) {
            if (isValidableSchemaModel(model)) {
                promises.push(model.runValidationFx())
            }
        }

        const [resolved, rejected] = await splitAllSettledResult<RunValidationFxDone, RunValidationFxFail>(promises)
        if (isNotEmpty(rejected)) {
            return Promise.reject(rejected)
        }

        return Promise.resolve(resolved)
    })
    const runValidationAllComponentsFx = attach({
        source: $componentsSchemasModel,
        effect: baseRunValidationAllComponentsFx,
    })

    $componentsValidationErrors.on(updateComponentsValidationErrorsEvent, (curErrors, { componentId, errors }) => {
        if (isEmpty(errors)) {
            delete curErrors[componentId]
            return { ...curErrors }
        }
        return { ...curErrors, [componentId]: errors }
    })
    $componentsValidationErrors.on(removeComponentValidationErrorsEvent, (curErrors, { componentId }) => {
        delete curErrors[componentId]
        return { ...curErrors }
    })

    $isValidationComponentsPending.on(runValidationAllComponentsFx, () => true)
    $isValidationComponentsPending.on(runValidationAllComponentsFx.finally, () => false)

    $rulesOverridesCache.on(setRulesOverridesCacheEvent, (_, newCache) => newCache)

    $hiddenComponents.on(setHiddenComponentsEvent, (_, newComponentsToHidden) => newComponentsToHidden)

    $readyConditionalValidationsRules.on(setReadyConditionalValidationsRulesEvent, (_, newReadyRules) => newReadyRules)

    init({
        runRelationsRulesOnUserActionsEvent,
        setRulesOverridesCacheEvent,
        setHiddenComponentsEvent,
        setReadyConditionalValidationsRulesEvent,
        initComponentSchemasEvent,
        updateComponentsSchemasModelFx,
        $hiddenComponents,
        $initialComponentsSchemas,
        $componentsSchemasModel,
        $rulesOverridesCache,
        $sortedRelationsDependents,
        $sortedRelationsDependentsByComponent,
        $rulesDepsFromSchema,
        $validationRuleSchemas,
        $readyConditionalValidationsRules,
        $operatorsForConditions: themeService.$operatorsForConditions,
        $relationsRules: themeService.$relationsRules,
    })

    console.log('depsPathsOptiondsBuilderRelationsRules: ', $depsPathsOptiondsBuilderRelationsRules.getState())
    console.log('rulesDepsFromSchema: ', $rulesDepsFromSchema.getState())
    console.log('sortedRelationsDependentsByComponent: ', $sortedRelationsDependentsByComponent.getState())
    console.log('sortedRelationsDependents: ', $sortedRelationsDependents.getState())

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
        runValidationAllComponentsFx,
        updateComponentsSchemasEvent,
        updateComponentPropertiesEvent,
        removeComponentsSchemasByIdsEvent,
        initComponentSchemasEvent,
        $schemasMap: $componentsSchemasModel,
        $isValidationComponentsPending,
        $componentsIsValid,
    }
}
