import { maxColSpan, SchemaLayout, ViewComponentLayout } from '@form-crafter/core'

export const getDefaultSchemaLayout = (): Required<SchemaLayout> => ({
    rowsSpanPx: { default: 16 },
    colsSpanPx: { default: 16 },
})

export const getDefaultViewNodeLayout = (): ViewComponentLayout => ({
    col: {
        default: maxColSpan,
    },
})
