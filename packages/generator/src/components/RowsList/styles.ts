import styled from '@emotion/styled'
import { Breakpoint, breakpoints } from '@form-crafter/core'

import { RootLayoutSpans } from '../../types'

type Props = {
    rootLayoutSpans: RootLayoutSpans
}

export const RowsListStyled = styled.div<Props>`
    display: flex;
    flex-direction: column;
    gap: ${({ rootLayoutSpans }) => rootLayoutSpans.rowsSpanPx.default}px;

    ${({ rootLayoutSpans }) =>
        Object.entries(rootLayoutSpans.colsSpanPx)
            .filter(([breakpoint]) => breakpoint !== 'default')
            .map(
                ([breakpoint, colSpan]) =>
                    `
                        @media (max-width: ${breakpoints[breakpoint as Breakpoint]}px) {
                            gap: ${colSpan}px;
                        }
                    `,
            )
            .join('\n')}
`
