import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'

import { ContainerModel, SetSchemaPayload } from '../types'

type Params = {
    schema: ContainerComponentSchema
}

export const createContainerModel = ({ schema }: Params): ContainerModel => {
    const $schema = createStore<ContainerComponentSchema>(schema)

    const updateProperties = createEvent<Partial<ContainerComponentProperties>>('updateProperties')
    const setSchema = createEvent<SetSchemaPayload>('setSchema')

    $schema.on(setSchema, (schema, { schema: newSchema }) => ({
        ...schema,
        ...newSchema,
    }))

    $schema.on(updateProperties, (model, newProperties) => ({
        ...model,
        properties: {
            ...model.properties,
            ...newProperties,
        },
    }))

    return { $schema, setSchema, onUpdateProperties: updateProperties }
}
