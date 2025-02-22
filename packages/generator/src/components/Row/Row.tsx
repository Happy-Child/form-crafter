import { ViewRowChild } from '@form-crafter/core'
import { FC, memo } from 'react'

import { useRootLayoutSpans, useViewRow } from '../../hooks'
import { ResolverComponent } from '../ResolverComponent'
import { RowStyled } from './styles'

type Props = ViewRowChild

export const Row: FC<Props> = memo(({ id: rowId }) => {
    const viewRow = useViewRow(rowId)
    const rootLayoutSpans = useRootLayoutSpans()

    return (
        <RowStyled rootLayoutSpans={rootLayoutSpans}>
            {viewRow.children.map(({ id: componentId }) => (
                <ResolverComponent key={componentId} id={componentId} rowId={rowId} />
            ))}
        </RowStyled>
    )
})

Row.displayName = 'Row'
