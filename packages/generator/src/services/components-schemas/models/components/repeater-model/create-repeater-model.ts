import { ComponentValidationError, RepeaterComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEffect, createEvent, createStore } from 'effector'

import { RepeaterModel, RunComponentValidationFxDone, RunComponentValidationFxFail } from '../types'

type Params = {
    schema: RepeaterComponentSchema
}

export const createRepeaterModel = ({ schema }: Params): RepeaterModel => {
    const $schema = createStore<RepeaterComponentSchema>(schema)

    const $firstError = createStore<ComponentValidationError | null>(null)
    const $errors = createStore<ComponentValidationError[]>([])

    const $isRequired = createStore<boolean>(false)

    const $isValidationPending = createStore<boolean>(false)

    const setSchemaEvent = createEvent<OptionalSerializableObject>('setSchemaEvent')

    const runValidationFx = createEffect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>(() => {
        return { errors: [] }
    })

    $isValidationPending.on(runValidationFx, () => true)
    $isValidationPending.on(runValidationFx.finally, () => false)

    $schema.on(setSchemaEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, $isRequired, $firstError, $errors, $isValidationPending, setSchemaEvent, runValidationFx }
}
