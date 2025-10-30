import { ComponentValidationError, RepeaterComponentSchema } from '@form-crafter/core'
import { createEffect, createEvent, createStore } from 'effector'

import { RepeaterModel, RunComponentValidationFxDone, RunComponentValidationFxFail, SetSchemaPayload } from '../types'

type Params = {
    schema: RepeaterComponentSchema
}

export const createRepeaterModel = ({ schema }: Params): RepeaterModel => {
    const $schema = createStore<RepeaterComponentSchema>(schema)

    const $firstError = createStore<ComponentValidationError | null>(null)
    const $errors = createStore<ComponentValidationError[]>([])

    const $isRequired = createStore<boolean>(false)

    const $isValidationPending = createStore<boolean>(false)

    const setSchema = createEvent<SetSchemaPayload>('setSchema')

    const runValidationFx = createEffect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>(() => {
        return { errors: [] }
    })

    $isValidationPending.on(runValidationFx, () => true)
    $isValidationPending.on(runValidationFx.finally, () => false)

    $schema.on(setSchema, (schema, { schema: newSchema }) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, $isRequired, $firstError, $errors, $isValidationPending, setSchema, runValidationFx }
}
