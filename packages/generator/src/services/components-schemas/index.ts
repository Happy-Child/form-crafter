import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { componentSchemaFactory } from './factories'
import { init } from './init'
import { ComponentsSchemasService, ComponentsSchemasServiceParams, SchemaMap, UpdateComponentPropertiesPayload } from './types'
import { extractComponentsDepsFromSchema } from './utils'

export type { ComponentsSchemasService }

const createInitialSchemasMap = (data: ComponentsSchemas) =>
    Object.entries(data).reduce<SchemaMap>((map, [componentId, componentSchema]) => {
        const model = componentSchemaFactory({ schema: componentSchema })
        map.set(componentId, model)
        return map
    }, new Map())

// RENAME GET -> BUILD

// ** Sort BEGIN **
const extractAffectedDeps = (componentId: EntityId, reverseDepsGraph: Record<EntityId, EntityId[]>): EntityId[] => {
    const deps = reverseDepsGraph[componentId]
    if (!deps?.length) {
        return []
    }

    const result: EntityId[] = []

    const queue: EntityId[] = [...deps]

    while (queue.length) {
        const componentId = queue.shift()!

        if (result.includes(componentId)) {
            continue
        }

        result.push(componentId)
        const deps = reverseDepsGraph[componentId]
        queue.push(...deps)
    }

    return result
}

const sortAffectedDeps = (affected: EntityId[], depsGraph: Record<EntityId, EntityId[]>): EntityId[] => {
    const subDepsGraph = Object.entries(depsGraph).reduce<Record<EntityId, EntityId[]>>((cur, [componentId, deps]) => {
        if (!affected.includes(componentId)) {
            return cur
        }
        cur[componentId] = deps.filter((depId) => affected.includes(depId))
        return cur
    }, {})

    const result: EntityId[] = []
    const visited = new Set<EntityId>()
    const visiting = new Set<EntityId>()

    const executeSort = (componentId: EntityId) => {
        if (visited.has(componentId)) {
            return
        }

        if (visiting.has(componentId)) {
            throw new Error(`Circular dependency detected in sortAffectedDeps: ${[...visiting, componentId].join(' -> ')}`)
        }

        visiting.add(componentId)

        for (const depId of subDepsGraph[componentId] || []) {
            executeSort(depId)
        }

        visiting.delete(componentId)
        visited.add(componentId)
        result.push(componentId)
    }

    for (const componentId of affected) {
        executeSort(componentId)
    }

    return result
}

const buildDepsResolutionOrder = (depsGraph: Record<EntityId, EntityId[]>, reverseDepsGraph: Record<EntityId, EntityId[]>): Record<EntityId, EntityId[]> => {
    const data: Record<EntityId, EntityId[]> = {}

    for (const [componentId] of Object.entries(reverseDepsGraph)) {
        const affected = extractAffectedDeps(componentId, reverseDepsGraph)
        const sortedAffeted = sortAffectedDeps(affected, depsGraph)
        data[componentId] = sortedAffeted
    }

    return data
}

// ОТЛОВ ЦИКЛА, прокид ошибки, получния сутрктуры для ошибки, отправка в ошбий сервис store для работы с ошибками
// ХРАНИЛИЖЕ ОШИБОК

// если есть то не запускать фабрики?

// в любом случае показывать на ui ошибку, но двать юзеру переопределять ui?

// А ЗАЧЕМ ПРОДОЛЖАТ ЬРАБОТУ С СТРОИТЬ ФОРМУ ПУСТУЮ, ЧАСТИЧНО, ЕСЛИ МОЖНО ПРОЧСИТЬ ИСКЛЮЧАНИЕ, ПЕРЕХВАТИТЬ ВНУТРИ GENERATOR И ПОКАЗТЬ UI ЮЗЕРА?
// ** Sort END **

export const createComponentsSchemasService = ({ initial, themeService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const initialSchemasMap = createInitialSchemasMap(initial)
    const $schemasMap = createStore<SchemaMap>(initialSchemasMap)

    const { depsGraph, reverseDepsGraph } = extractComponentsDepsFromSchema(initial, themeService.$depsPathsRulesComponents.getState())
    const depsResolutionOrder = buildDepsResolutionOrder(depsGraph, reverseDepsGraph)

    console.log('depsPathsRulesComponents: ', themeService.$depsPathsRulesComponents.getState())
    console.log('depsGraph: ', depsGraph)
    console.log('reverseDepsGraph: ', reverseDepsGraph)
    console.log('depsResolutionOrder: ', depsResolutionOrder)

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
        $schemasMap,
        updateComponentsSchemasEvent,
        updateComponentPropertiesEvent,
        removeComponentsSchemasByIdsEvent,
    }
}
