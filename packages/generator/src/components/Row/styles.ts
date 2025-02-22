import styled from '@emotion/styled'
import { Breakpoint, breakpoints } from '@form-crafter/core'

import { RootLayoutSpans } from '../../types'

type Props = {
    rootLayoutSpans: RootLayoutSpans
}

export const RowStyled = styled.div<Props>`
    display: flex;
    margin: 0 calc(${({ rootLayoutSpans }) => rootLayoutSpans.colsSpanPx.default}px / -2);

    ${({ rootLayoutSpans }) =>
        Object.entries(rootLayoutSpans.colsSpanPx)
            .filter(([breakpoint]) => breakpoint !== 'default')
            .map(
                ([breakpoint, colSpan]) =>
                    `
                        @media (max-width: ${breakpoints[breakpoint as Breakpoint]}px) {
                            margin: 0 calc(${colSpan}px / -2);
                        }
                    `,
            )
            .join('\n')}
`
