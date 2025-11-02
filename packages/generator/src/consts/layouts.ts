import { SchemaLayout } from '@form-crafter/core'

export const getDefaultSchemaLayout = (): Required<SchemaLayout> => ({
    rowsSpanPx: { default: 16 },
    colsSpanPx: { default: 16 },
})
