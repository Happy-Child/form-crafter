import { RepeaterComponentSchema } from '@form-crafter/core'
import { createStore, StoreWritable } from 'effector'

export type RepeaterSchemaModelParams = {
    schema: RepeaterComponentSchema
}

export type RepeaterSchemaModel = {
    $model: StoreWritable<RepeaterComponentSchema>
}

export const repeaterSchemaModel = ({ schema }: RepeaterSchemaModelParams): RepeaterSchemaModel => {
    const $model = createStore<RepeaterComponentSchema>(schema)

    return { $model }
}
