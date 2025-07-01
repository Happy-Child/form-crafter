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
    RulesOverridesCacheStore,
    UpdateComponentPropertiesPayload,
} from './types'
import { buildDepsResolutionOrder, extractComponentsDepsFromSchema } from './utils'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const $initialComponentsSchemas = createStore<ComponentsSchemas>(initial)

    const $componentsDepsFromSchema = combine($initialComponentsSchemas, themeService.$depsPathsRulesComponents, extractComponentsDepsFromSchema)
    const $depsResolutionOrder = combine($componentsDepsFromSchema, ({ depsGraph, reverseDepsGraph }) => buildDepsResolutionOrder(depsGraph, reverseDepsGraph))

    const calcRelationsRulesEvent = createEvent<CalcRelationsRulesPayload>('calcRelationsRulesEvent')

    const componentsSchemasModel = (data: ComponentsSchemas) => {
        const result = Object.entries(data).reduce<SchemaMap>((map, [componentId, componentSchema]) => {
            const model = componentSchemaModel({ schema: componentSchema, calcRelationsRulesEvent })
            map.set(componentId, model)
            return map
        }, new Map())

        const $model = createStore<SchemaMap>(result)

        return $model
    }
    const $componentsSchemasModel = componentsSchemasModel(initial)

    const $rulesOverridesCache = createStore<RulesOverridesCacheStore>({})

    const $hiddenComponents = createStore<Set<EntityId>>(new Set())

    const setRulesOverridesCacheEvent = createEvent<RulesOverridesCacheStore>('setRulesOverridesCacheEvent')

    const setHiddenComponentsEvent = createEvent<Set<EntityId>>('setHiddenComponentsEvent')

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

    init({
        calcRelationsRulesEvent,
        setRulesOverridesCacheEvent,
        setHiddenComponentsEvent,
        updateComponentsSchemasModelFx,
        $hiddenComponents,
        $initialComponentsSchemas,
        $componentsSchemasModel,
        $rulesOverridesCache,
        $depsResolutionOrder,
        $componentsDepsFromSchema,
        $operatorsForConditions: themeService.$operatorsForConditions,
        $relationsRulesMap: themeService.$relationsRulesMap,
    })

    console.log('depsPathsRulesComponents: ', themeService.$depsPathsRulesComponents.getState())
    console.log('componentsDepsFromSchema: ', $componentsDepsFromSchema.getState())
    console.log('depsResolutionOrder: ', $depsResolutionOrder.getState())

    // вроде бы так:
    // 1. на событие onChangeProperties (if value can beed changed) или onAddGroup идём наружу?
    // 2. для repeater хотел создать отдельную структуру, НО передумал и просто запускаю по id проход по всем компонентам
    // 3. для editable/uploader по сути то же самое?

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
    }
}
