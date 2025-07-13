import { Schema, SchemaLayout } from '@form-crafter/core'
import { StoreWritable } from 'effector'

export type SchemaService = {
    $schema: StoreWritable<Schema>
    $layout: StoreWritable<Required<SchemaLayout>>
}

export type SchemaServiceParams = Pick<Schema, 'layout'> & {}
