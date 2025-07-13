import { StaticComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { StaticSchemaModel } from '../../../types'

export type StaticSchemaModelParams = {
    schema: StaticComponentSchema
}

export const staticSchemaModel = ({ schema }: StaticSchemaModelParams): StaticSchemaModel => {
    const $schema = createStore<StaticComponentSchema>(schema)

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    $schema.on(setModelEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, setModelEvent }
}
