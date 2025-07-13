import { RepeaterComponentSchema, ValidationRuleComponentError } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { RepeaterSchemaModel } from '../../../types'

export type RepeaterSchemaModelParams = {
    schema: RepeaterComponentSchema
}

export const repeaterSchemaModel = ({ schema }: RepeaterSchemaModelParams): RepeaterSchemaModel => {
    const $schema = createStore<RepeaterComponentSchema>(schema)

    const $error = createStore<ValidationRuleComponentError | null>(null)

    const $isRequired = createStore<boolean>(false)

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    const runValidationEvent = createEvent('runValidationEvent')

    $schema.on(setModelEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, $isRequired, $error, setModelEvent, runValidationEvent }
}
