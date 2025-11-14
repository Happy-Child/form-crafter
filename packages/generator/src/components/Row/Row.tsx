import { FC, memo } from 'react'

import { EntityId } from '@form-crafter/core'

import { useRootLayoutSpans, useViewRow } from '../../hooks'
import { ResolverComponent } from '../ResolverComponent'
import { RowStyled } from './styles'

type Props = {
    id: EntityId
}

export const Row: FC<Props> = memo(({ id: rowId }) => {
    const viewRow = useViewRow(rowId)
    const rootLayoutSpans = useRootLayoutSpans()

    return (
        <RowStyled rootLayoutSpans={rootLayoutSpans}>
            {viewRow.childrenComponents.map((componentId) => (
                <ResolverComponent key={componentId} id={componentId} />
            ))}
        </RowStyled>
    )
})

Row.displayName = 'Row'
