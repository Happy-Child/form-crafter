import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { ContainerSchemaModel } from '../../../types'

export type ContainerSchemaModelParams = {
    schema: ContainerComponentSchema
}

export const containerSchemaModel = ({ schema }: ContainerSchemaModelParams): ContainerSchemaModel => {
    const $schema = createStore<ContainerComponentSchema>(schema)

    const updatePropertiesEvent = createEvent<Partial<ContainerComponentProperties>>('updatePropertiesEvent')
    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    $schema.on(setModelEvent, (schema, newSchema) => ({
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

    return { $schema, setModelEvent, onUpdatePropertiesEvent: updatePropertiesEvent }
}
