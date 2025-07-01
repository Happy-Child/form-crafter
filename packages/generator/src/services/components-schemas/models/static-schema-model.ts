import { StaticComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { StaticSchemaModel } from '../../../types'

export type StaticSchemaModelParams = {
    schema: StaticComponentSchema
}

export const staticSchemaModel = ({ schema }: StaticSchemaModelParams): StaticSchemaModel => {
    const $model = createStore<StaticComponentSchema>(schema)

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    $model.on(setModelEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $model, setModelEvent }
}
