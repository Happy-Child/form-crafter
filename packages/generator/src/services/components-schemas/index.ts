import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'

import { init } from './init'
import { ComponentsSchemasService, ComponentsSchemasServiceParams, UpdateComponentPropertiesPayload } from './types'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
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
            Object.fromEntries(Object.entries(curData).filter(([compoentId]) => !ids.includes(compoentId))),
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

    init({})

    return {
        $schemas,
        updateComponentsSchemasEvent,
        updateComponentPropertiesEvent,
        removeComponentsSchemasByIdsEvent,
    }
}
