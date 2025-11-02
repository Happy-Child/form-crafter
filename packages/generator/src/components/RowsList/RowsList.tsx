import { FC, memo, PropsWithChildren } from 'react'

import { EntityId } from '@form-crafter/core'

import { useRootLayoutSpans } from '../../hooks'
import { Row } from '../Row'
import { RowsListStyled } from './styles'

export type Props = PropsWithChildren<{
    rows?: EntityId[]
}>

export const RowsList: FC<Props> = memo(({ rows, children }) => {
    const rootLayoutSpans = useRootLayoutSpans()

    return <RowsListStyled rootLayoutSpans={rootLayoutSpans}>{rows?.map((rowId) => <Row key={rowId} id={rowId} />) || children}</RowsListStyled>
})

RowsList.displayName = 'RowsList'
