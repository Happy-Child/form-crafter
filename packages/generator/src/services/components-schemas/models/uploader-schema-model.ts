import { UploaderComponentProperties, UploaderComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { UploaderSchemaModel } from '../../../types'

export type UploaderSchemaModelParams = {
    schema: UploaderComponentSchema
}

export const uploaderSchemaModel = ({ schema }: UploaderSchemaModelParams): UploaderSchemaModel => {
    const $model = createStore<UploaderComponentSchema>(schema)

    const updatePropertiesEvent = createEvent<Partial<UploaderComponentProperties>>('onUpdatePropertiesEvent')
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
