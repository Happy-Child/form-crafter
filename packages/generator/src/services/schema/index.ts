import { Schema, SchemaLayout } from '@form-crafter/core'
import { createStore } from 'effector'

import { getDefaultSchemaLayout } from '../../consts'
import { init } from './init'
import { SchemaService, SchemaServiceParams } from './types'

const defaultSchemaLayout = getDefaultSchemaLayout()

const getLayout = (layout: SchemaServiceParams['layout']): Required<SchemaLayout> => ({
    rowsSpanPx: layout?.rowsSpanPx || defaultSchemaLayout.rowsSpanPx,
    colsSpanPx: layout?.colsSpanPx || defaultSchemaLayout.colsSpanPx,
})

export type { SchemaService }

export const createSchemaService = (schema: Schema): SchemaService => {
    const $schema = createStore<Schema>(schema)
    const $layout = createStore<Required<SchemaLayout>>(getLayout(schema.layout))

    init({})

    return {
        $schema,
        $layout,
    }
}
