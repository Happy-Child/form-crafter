import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore } from 'effector'

import { SchemaMap } from '../../types'
import { init } from './init'
import { componentSchemaModel } from './models'
import {
    CalcRelationsRulesPayload,
    ComponentsSchemasService,
    ComponentsSchemasServiceParams,
    ReadyValidationsRules,
    RulesOverridesCache,
    UpdateComponentPropertiesPayload,
    ValidationRuleSchemas,
} from './types'
import { buildSortedDependents, extractDepsFromSchema, getDepsPathsOptiondsBuilderRelationsRules, topologicalSortDeps } from './utils'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService, schemaService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const $initialComponentsSchemas = createStore<ComponentsSchemas>(initial)

    const $readyConditionalValidationsRules = createStore<ReadyValidationsRules>({})

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
                schema: componentSchema,
                runRelationsRulesEvent: runRelationsRulesOnUserActionsEvent,
                additionalTriggers,
                themeService,
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
        SchemaMap
    >(({ componentsSchemasModel, componentsSchemasToUpdate }) => {
        const newMap = Object.entries(componentsSchemasToUpdate).reduce((map, [componentId, schema]) => {
            const model = map.get(componentId)
            if (isNotEmpty(model)) {
                model.setModelEvent(schema)
            }
            return map
        }, new Map(componentsSchemasModel))

        return newMap
    })

    const updateComponentsSchemasModelFx = attach({
        source: $componentsSchemasModel,
        mapParams: (componentsSchemasToUpdate: ComponentsSchemas, componentsSchemasModel: SchemaMap) => ({
            componentsSchemasModel,
            componentsSchemasToUpdate,
        }),
        effect: baseComponentsSchemasModelFx,
    })

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
        $schemasMap: $componentsSchemasModel,
        updateComponentsSchemasEvent,
        updateComponentPropertiesEvent,
        removeComponentsSchemasByIdsEvent,
        initComponentSchemasEvent,
    }
}
