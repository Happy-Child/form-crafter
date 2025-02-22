import { useMemo } from 'react'

import { RootLayoutSpans } from '../types'
import { useGeneratorLayout } from './useGeneratorLayout'

export const useRootLayoutSpans = (): RootLayoutSpans => {
    const layout = useGeneratorLayout()

    return useMemo(
        () => ({
            rowsSpanPx: {
                default: layout.rowsSpanPx.default,
                sm: layout.rowsSpanPx.sm || layout.rowsSpanPx.default,
                md: layout.rowsSpanPx.md || layout.rowsSpanPx.default,
                lg: layout.rowsSpanPx.lg || layout.rowsSpanPx.default,
                xl: layout.rowsSpanPx.xl || layout.rowsSpanPx.default,
                xxl: layout.rowsSpanPx.xxl || layout.rowsSpanPx.default,
            },
            colsSpanPx: {
                default: layout.colsSpanPx.default,
                sm: layout.colsSpanPx.sm || layout.colsSpanPx.default,
                md: layout.colsSpanPx.md || layout.colsSpanPx.default,
                lg: layout.colsSpanPx.lg || layout.colsSpanPx.default,
                xl: layout.colsSpanPx.xl || layout.colsSpanPx.default,
                xxl: layout.colsSpanPx.xxl || layout.colsSpanPx.default,
            },
        }),
        [layout],
    )
}
