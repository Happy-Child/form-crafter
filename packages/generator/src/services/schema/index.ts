import { SchemaLayout } from '@form-crafter/core'
import { createStore } from 'effector'

import { getDefaultSchemaLayout } from '../../consts'
import { init } from './init'
import { SchemaService, SchemaServiceParams, SchemaStore } from './types'

const defaultSchemaLayout = getDefaultSchemaLayout()

const getLayout = (layout: SchemaServiceParams['layout']): Required<SchemaLayout> => ({
    rowsSpanPx: layout?.rowsSpanPx || defaultSchemaLayout.rowsSpanPx,
    colsSpanPx: layout?.colsSpanPx || defaultSchemaLayout.colsSpanPx,
})

export type { SchemaService }

export const createSchemaService = ({ layout }: SchemaServiceParams): SchemaService => {
    const $schema = createStore<SchemaStore>({ layout: getLayout(layout) })

    init({})

    return {
        $schema,
    }
}
