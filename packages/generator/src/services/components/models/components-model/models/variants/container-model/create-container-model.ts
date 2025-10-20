import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'

import { ContainerModel, SetSchemaPayload } from '../types'

type Params = {
    schema: ContainerComponentSchema
}

export const createContainerModel = ({ schema }: Params): ContainerModel => {
    const $schema = createStore<ContainerComponentSchema>(schema)

    const updatePropertiesEvent = createEvent<Partial<ContainerComponentProperties>>('updatePropertiesEvent')
    const setSchemaEvent = createEvent<SetSchemaPayload>('setSchemaEvent')

    $schema.on(setSchemaEvent, (schema, { schema: newSchema }) => ({
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
