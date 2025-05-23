import { StaticComponentSchema } from '@form-crafter/core'
import { createStore, StoreWritable } from 'effector'

export type StaticSchemaFactoryParams = {
    schema: StaticComponentSchema
}

export type StaticSchemaFactory = {
    $schema: StoreWritable<StaticComponentSchema>
}

export const staticSchemaFactory = ({ schema }: StaticSchemaFactoryParams): StaticSchemaFactory => {
    const $schema = createStore<StaticComponentSchema>(schema)

    return { $schema }
}
