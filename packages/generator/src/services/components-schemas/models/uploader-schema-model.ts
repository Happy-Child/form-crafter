import { UploaderComponentProperties, UploaderComponentSchema, ValidationRuleComponentError } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { UploaderSchemaModel } from '../../../types'

export type UploaderSchemaModelParams = {
    schema: UploaderComponentSchema
}

export const uploaderSchemaModel = ({ schema }: UploaderSchemaModelParams): UploaderSchemaModel => {
    const $schema = createStore<UploaderComponentSchema>(schema)

    const $error = createStore<ValidationRuleComponentError | null>(null)

    const $isRequired = createStore<boolean>(false)

    const updatePropertiesEvent = createEvent<Partial<UploaderComponentProperties>>('onUpdatePropertiesEvent')

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    const runValidationEvent = createEvent('runValidationEvent')

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

    return { $schema, $error, $isRequired, setModelEvent, onUpdatePropertiesEvent: updatePropertiesEvent, runValidationEvent }
}
