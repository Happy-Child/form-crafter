import { StaticComponentSchema } from '@form-crafter/core'
import { createStore, StoreWritable } from 'effector'

export type StaticSchemaModelParams = {
    schema: StaticComponentSchema
}

export type StaticSchemaModel = {
    $model: StoreWritable<StaticComponentSchema>
}

export const staticSchemaModel = ({ schema }: StaticSchemaModelParams): StaticSchemaModel => {
    const $model = createStore<StaticComponentSchema>(schema)

    return { $model }
}
