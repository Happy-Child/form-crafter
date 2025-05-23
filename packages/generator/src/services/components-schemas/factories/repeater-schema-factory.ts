import { RepeaterComponentSchema } from '@form-crafter/core'
import { createStore, StoreWritable } from 'effector'

export type RepeaterSchemaFactoryParams = {
    schema: RepeaterComponentSchema
}

export type RepeaterSchemaFactory = {
    $schema: StoreWritable<RepeaterComponentSchema>
}

export const repeaterSchemaFactory = ({ schema }: RepeaterSchemaFactoryParams): RepeaterSchemaFactory => {
    const $schema = createStore<RepeaterComponentSchema>(schema)

    return { $schema }
}
