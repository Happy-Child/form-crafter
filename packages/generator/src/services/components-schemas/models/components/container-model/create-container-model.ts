import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { ContainerModel } from '../types'

type Params = {
    schema: ContainerComponentSchema
}

export const createContainerModel = ({ schema }: Params): ContainerModel => {
    const $schema = createStore<ContainerComponentSchema>(schema)

    const updatePropertiesEvent = createEvent<Partial<ContainerComponentProperties>>('updatePropertiesEvent')
    const setSchemaEvent = createEvent<OptionalSerializableObject>('setSchemaEvent')

    $schema.on(setSchemaEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    $schema.on(updatePropertiesEvent, (model, newProperties) => ({
        ...model,
        properties: {
            ...model.properties,
            ...newProperties,
        },
    }))

    return { $schema, setSchemaEvent, onUpdatePropertiesEvent: updatePropertiesEvent }
}
