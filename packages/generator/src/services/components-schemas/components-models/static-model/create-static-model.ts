import { StaticComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { StaticModel } from '../types'

type Params = {
    schema: StaticComponentSchema
}

export const createStaticModel = ({ schema }: Params): StaticModel => {
    const $schema = createStore<StaticComponentSchema>(schema)

    const setSchemaEvent = createEvent<OptionalSerializableObject>('setSchemaEvent')

    $schema.on(setSchemaEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, setSchemaEvent }
}
