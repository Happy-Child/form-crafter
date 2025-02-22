import styled from '@emotion/styled'
import { Breakpoint, breakpoints, ColSpan, maxColSpan, ViewComponentLayout } from '@form-crafter/core'

import { RootLayoutSpans } from '../../types'

const isAuto = (value: ColSpan) => value === 'auto'

type Props = {
    rootLayoutSpans: RootLayoutSpans
    componentLayout: ViewComponentLayout
}

export const LayoutStyled = styled.div<Props>`
    padding: 0 calc(${(props) => props.rootLayoutSpans.colsSpanPx.default}px / 2);
    ${({ componentLayout }) =>
        isAuto(componentLayout.col.default)
            ? `
                flex-grow: 1;
                flex-shrink: 1;
                flex-basis: 0;
            `
            : `
                flex: 0 0 calc(${componentLayout.col.default} * (100% / ${maxColSpan}));
            `}

    ${({ componentLayout, rootLayoutSpans }) =>
        Object.entries(componentLayout.col)
            .filter(([breakpoint]) => breakpoint !== 'default')
            .map(
                ([breakpoint, colSpan]) => `
                    @media (max-width: ${breakpoints[breakpoint as Breakpoint]}px) {
                        padding: 0 calc(${rootLayoutSpans.colsSpanPx[breakpoint as Breakpoint]}px / 2);

                        ${
                            isAuto(colSpan)
                                ? `
                                    flex-grow: 1;
                                    flex-shrink: 1;
                                    flex-basis: 0;
                                    `
                                : `
                                    flex: 0 0 calc(${colSpan} * (100% / ${maxColSpan}));
                                `
                        }
                    }
                `,
            )
            .join('\n')}
`
