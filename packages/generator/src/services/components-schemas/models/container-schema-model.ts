import { ContainerComponentProperties, ContainerComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { ContainerSchemaModel } from '../../../types'

export type ContainerSchemaModelParams = {
    schema: ContainerComponentSchema
}

export const containerSchemaModel = ({ schema }: ContainerSchemaModelParams): ContainerSchemaModel => {
    const $model = createStore<ContainerComponentSchema>(schema)

    const updatePropertiesEvent = createEvent<Partial<ContainerComponentProperties>>('updatePropertiesEvent')
    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    $model.on(setModelEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    $model.on(updatePropertiesEvent, (model, newProperties) => ({
        ...model,
        properties: {
            ...model.properties,
            ...newProperties,
        },
    }))

    return { $model, setModelEvent, onUpdatePropertiesEvent: updatePropertiesEvent }
}
