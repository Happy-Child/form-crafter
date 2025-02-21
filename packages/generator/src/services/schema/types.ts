import { Schema, SchemaLayout } from '@form-crafter/core'
import { StoreWritable } from 'effector'

export type SchemaStore = {
    layout: Required<SchemaLayout>
}

export type SchemaService = {
    $schema: StoreWritable<SchemaStore>
}

export type SchemaServiceParams = Pick<Schema, 'layout'> & {}
