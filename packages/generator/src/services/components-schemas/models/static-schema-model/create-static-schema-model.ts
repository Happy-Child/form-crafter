import { StaticComponentSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { createEvent, createStore } from 'effector'

import { StaticSchemaModel } from '../../../../types'

export type StaticSchemaModelParams = {
    schema: StaticComponentSchema
}

export const createStaticSchemaModel = ({ schema }: StaticSchemaModelParams): StaticSchemaModel => {
    const $schema = createStore<StaticComponentSchema>(schema)

    const setSchemaEvent = createEvent<OptionalSerializableObject>('setSchemaEvent')

    $schema.on(setSchemaEvent, (schema, newSchema) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, setSchemaEvent }
}
