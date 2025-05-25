import { ComponentsSchemas, EntityId, isConditionsSuccessful } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore, sample, StoreValue } from 'effector'
import { clone, cloneDeep } from 'lodash-es'

import { init } from './init'
import { ComponentSchemaModel, componentSchemaModel } from './models'
import { CalcRelationsRulesPayload, ComponentsSchemasService, ComponentsSchemasServiceParams, SchemaMap, UpdateComponentPropertiesPayload } from './types'
import { buildDepsResolutionOrder, extractComponentsDepsFromSchema } from './utils'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const { depsGraph, reverseDepsGraph } = extractComponentsDepsFromSchema(initial, themeService.$depsPathsRulesComponents.getState())
    const $depsResolutionOrder = createStore<Record<EntityId, EntityId[]>>(buildDepsResolutionOrder(depsGraph, reverseDepsGraph))

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

    const testEvent = createEvent('testEvent')
    testEvent.watch((data) => console.log(`testEvent: `, data))

    // ДОЛЖНА БЫТЬ ОДНА ФУНКЦИЯ, В КОТОРУЮ ПЕРЕДЕВАТЬ PAYLOAD И В НЕЁ ВСЕ ПРОИСХОДИТ
    // ВЫЗВАТЬ С ID, А ДАЛЬШЕ ИТЕРИРОВАТЬСЯ ПО RESOLUTIONS ORDER, ЕСЛИ НЕ ПУСТОЕ
    // В КОНЦЕ НЕ ПОНЯТНО ЧТО ДЕЛАТЬ, КАК ВЫХОДИТЬ И ПРОСТО СЕТАТЬ ТО, ЧТО ПЕРЕДАЛ ЮЗЕР, БЕЗ МОДИФИКАЦИЙ

    // ОЧЕНЬ ЖИРНЫЙ SAMPLE!!!
    sample({
        source: { componentsSchemasModel: $componentsSchemasModel, depsResolutionOrder: $depsResolutionOrder },
        clock: calcRelationsRulesEvent,
        fn: ({ componentsSchemasModel, depsResolutionOrder }, { id: componentIdToUpdate, data: propertiesToUpdate }) => {
            const componentsSchemas = Object.entries(Object.fromEntries(componentsSchemasModel)).reduce<
                Record<EntityId, StoreValue<ComponentSchemaModel['$model']>>
            >((obj, [componentId, value]) => ({ ...obj, [componentId]: value.$model.getState() }), {})

            const tempComponentsSchemas = cloneDeep(componentsSchemas)
            tempComponentsSchemas[componentIdToUpdate].properties = {
                ...tempComponentsSchemas[componentIdToUpdate].properties,
                ...propertiesToUpdate,
            }

            const execute = (componentId: EntityId) => {
                const componentModel = tempComponentsSchemas[componentId]
                const relationsRules = componentModel.relations

                relationsRules?.options?.forEach(({ id, ruleName, options, condition }) => {
                    const success = isNotEmpty(condition) && isConditionsSuccessful(condition, tempComponentsSchemas)
                    if (success) {
                        //
                    }
                })

                const depsResolutionOrderToUpdate = depsResolutionOrder[componentId]
                depsResolutionOrderToUpdate?.forEach(execute)
            }
            execute(componentIdToUpdate, propertiesToUpdate)

            if (!isNotEmpty(depsResolutionOrderToUpdate)) {
                // выйти
            }

            return {}
        },
        target: testEvent,
    })

    console.log('depsPathsRulesComponents: ', themeService.$depsPathsRulesComponents.getState())
    console.log('depsGraph: ', depsGraph)
    console.log('reverseDepsGraph: ', reverseDepsGraph)
    console.log('$depsResolutionOrder: ', $depsResolutionOrder.getState())

    // вроде бы так:
    // 1. на событие onChangeProperties (if value can beed changed) или onAddGroup идём наружу?
    // 2. для repeater хотел создать отдельную структуру, НО передумал и просто запускаю по id проход по всем компонентам
    // 3. для editable/uploader по сути то же самое?

    // OLD BEGIN
    const $schemas = createStore<ComponentsSchemas>(initial)

    const updateComponentsSchemasEvent = createEvent<ComponentsSchemas>('updateComponentsSchemasEvent')
    const removeComponentsSchemasByIdsEvent = createEvent<{ ids: EntityId[] }>('removeComponentsSchemasByIdsEvent')
    const updateComponentPropertiesEvent = createEvent<UpdateComponentPropertiesPayload>('updateComponentPropertiesEvent')

    $schemas
        .on(updateComponentsSchemasEvent, (curData, data) => ({
            ...curData,
            ...data,
        }))
        .on(removeComponentsSchemasByIdsEvent, (curData, { ids }) =>
            Object.fromEntries(Object.entries(curData).filter(([componentId]) => !ids.includes(componentId))),
        )

    $schemas.on(updateComponentPropertiesEvent, (curData, { id, data }) => ({
        ...curData,
        [id]: {
            ...curData[id],
            properties: {
                ...curData[id].properties,
                ...data,
            },
        },
    }))
    // OLD END

    init({})

    return {
        $schemasMap: $componentsSchemasModel,
        updateComponentsSchemasEvent,
        updateComponentPropertiesEvent,
        removeComponentsSchemasByIdsEvent,
    }
}
