import { ComponentValidationError, RepeaterComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEffect, createEvent, createStore } from 'effector'

import { RepeaterSchemaModel } from '../../../types'
import { RunValidationFxDone, RunValidationFxFail } from './types'

export type RepeaterSchemaModelParams = {
    schema: RepeaterComponentSchema
}

export const repeaterSchemaModel = ({ schema }: RepeaterSchemaModelParams): RepeaterSchemaModel => {
    const $schema = createStore<RepeaterComponentSchema>(schema)

    const $error = createStore<ComponentValidationError | null>(null)
    const $errors = createStore<ComponentValidationError[]>([])

    const $isRequired = createStore<boolean>(false)

    const $isValidationPending = createStore<boolean>(false)

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

    return { $schema, $isRequired, $error, $errors, $isValidationPending, setModelEvent, runValidationFx }
}
