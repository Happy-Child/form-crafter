import { SetSchemaPayload, StaticComponentSchema, StaticModel } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'

type Params = {
    schema: StaticComponentSchema
}

export const createStaticModel = ({ schema }: Params): StaticModel => {
    const $schema = createStore<StaticComponentSchema>(schema)

    const setSchema = createEvent<SetSchemaPayload>('setSchema')

    $schema.on(setSchema, (schema, { schema: newSchema }) => ({
        ...schema,
        ...newSchema,
    }))

    return { $schema, setSchema }
}
