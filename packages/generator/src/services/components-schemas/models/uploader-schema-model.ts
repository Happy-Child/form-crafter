import { ComponentValidationError, UploaderComponentProperties, UploaderComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEffect, createEvent, createStore } from 'effector'

import { UploaderSchemaModel } from '../../../types'
import { RunValidationFxDone, RunValidationFxFail } from './types'

export type UploaderSchemaModelParams = {
    schema: UploaderComponentSchema
}

export const uploaderSchemaModel = ({ schema }: UploaderSchemaModelParams): UploaderSchemaModel => {
    const $schema = createStore<UploaderComponentSchema>(schema)

    const $error = createStore<ComponentValidationError | null>(null)
    const $errors = createStore<ComponentValidationError[]>([])

    const $isRequired = createStore<boolean>(false)

    const $isValidationPending = createStore<boolean>(false)

    const updatePropertiesEvent = createEvent<Partial<UploaderComponentProperties>>('onUpdatePropertiesEvent')

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    const runValidationFx = createEffect<void, RunValidationFxDone, RunValidationFxFail>(() => {
        return { errors: [] }
    })

    $isValidationPending.on(runValidationFx, () => true)
    $isValidationPending.on(runValidationFx.finally, () => false)

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

    return { $schema, $error, $errors, $isRequired, $isValidationPending, setModelEvent, onUpdatePropertiesEvent: updatePropertiesEvent, runValidationFx }
}
