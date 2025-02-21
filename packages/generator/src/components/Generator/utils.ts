import { SchemaLayout } from '@form-crafter/core'

import { getStyles } from '../../utils'

export const getStyleVariables = (schemaLayout: Required<SchemaLayout>) =>
    getStyles({
        '--schemaLayoutRowsSpanDefault': `${schemaLayout.rowsSpanPx.default}px`,
        '--schemaLayoutRowsSpanXxl': `${schemaLayout.rowsSpanPx.xxl || schemaLayout.rowsSpanPx.default}px`,
        '--schemaLayoutRowsSpanXl': `${schemaLayout.rowsSpanPx.xl || schemaLayout.rowsSpanPx.default}px`,
        '--schemaLayoutRowsSpanLg': `${schemaLayout.rowsSpanPx.lg || schemaLayout.rowsSpanPx.default}px`,
        '--schemaLayoutRowsSpanMd': `${schemaLayout.rowsSpanPx.md || schemaLayout.rowsSpanPx.default}px`,
        '--schemaLayoutRowsSpanSm': `${schemaLayout.rowsSpanPx.sm || schemaLayout.rowsSpanPx.default}px`,
        '--schemaLayoutColsSpanDefault': `${schemaLayout.colsSpanPx.default}px`,
        '--schemaLayoutColsSpanXxl': `${schemaLayout.colsSpanPx.xxl || schemaLayout.colsSpanPx.default}px`,
        '--schemaLayoutColsSpanXl': `${schemaLayout.colsSpanPx.xl || schemaLayout.colsSpanPx.default}px`,
        '--schemaLayoutColsSpanLg': `${schemaLayout.colsSpanPx.lg || schemaLayout.colsSpanPx.default}px`,
        '--schemaLayoutColsSpanMd': `${schemaLayout.colsSpanPx.md || schemaLayout.colsSpanPx.default}px`,
        '--schemaLayoutColsSpanSm': `${schemaLayout.colsSpanPx.sm || schemaLayout.colsSpanPx.default}px`,
    })
