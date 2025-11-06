import styled from '@emotion/styled'
import { ColSpan, maxColSpan, ViewComponentLayout } from '@form-crafter/core'

import { RootLayoutSpans } from '../../types'

const isAuto = (value: ColSpan) => value === 'auto'

type Props = {
    rootLayoutSpans: RootLayoutSpans
    componentLayout: ViewComponentLayout
}

export const LayoutStyled = styled.div<Props>`
    padding: 0 calc(${(props) => props.rootLayoutSpans.colsSpanPx.default}px / 2);
    ${({ componentLayout }) =>
        isAuto(componentLayout.col)
            ? `
                min-width: 0;
                flex-grow: 1;
                flex-shrink: 1;
                flex-basis: 0;
            `
            : `
                min-width: 0;
                flex: 0 0 calc(${componentLayout.col} * (100% / ${maxColSpan}));
            `}
`
