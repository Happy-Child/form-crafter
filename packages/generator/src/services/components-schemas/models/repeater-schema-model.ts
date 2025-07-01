import { RepeaterComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { RepeaterSchemaModel } from '../../../types'

export type RepeaterSchemaModelParams = {
    schema: RepeaterComponentSchema
}

export const repeaterSchemaModel = ({ schema }: RepeaterSchemaModelParams): RepeaterSchemaModel => {
    const $model = createStore<RepeaterComponentSchema>(schema)

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    $model.on(setModelEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $model, setModelEvent }
}
