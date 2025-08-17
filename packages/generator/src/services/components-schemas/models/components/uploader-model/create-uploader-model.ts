import { ComponentValidationError, UploaderComponentProperties, UploaderComponentSchema } from '@form-crafter/core'
import { createEffect, createEvent, createStore } from 'effector'

import { RunComponentValidationFxDone, RunComponentValidationFxFail, SetSchemaPayload, UploaderModel } from '../types'

type Params = {
    schema: UploaderComponentSchema
}

export const createUploaderModel = ({ schema }: Params): UploaderModel => {
    const $schema = createStore<UploaderComponentSchema>(schema)

    const $firstError = createStore<ComponentValidationError | null>(null)
    const $errors = createStore<ComponentValidationError[]>([])

    const $isRequired = createStore<boolean>(false)

    const $isValidationPending = createStore<boolean>(false)

    const updatePropertiesEvent = createEvent<Partial<UploaderComponentProperties>>('onUpdatePropertiesEvent')

    const setSchemaEvent = createEvent<SetSchemaPayload>('setSchemaEvent')

    const runValidationFx = createEffect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>(() => {
        return { errors: [] }
    })

    $isValidationPending.on(runValidationFx, () => true)
    $isValidationPending.on(runValidationFx.finally, () => false)

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

    return { $schema, $firstError, $errors, $isRequired, $isValidationPending, setSchemaEvent, onUpdatePropertiesEvent: updatePropertiesEvent, runValidationFx }
}
