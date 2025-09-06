import { FC, memo, PropsWithChildren } from 'react'

import { ViewRowChild } from '@form-crafter/core'

import { useRootLayoutSpans } from '../../hooks'
import { Row } from '../Row'
import { RowsListStyled } from './styles'

export type Props = PropsWithChildren<{
    rows?: ViewRowChild[]
}>

export const RowsList: FC<Props> = memo(({ rows, children }) => {
    const rootLayoutSpans = useRootLayoutSpans()

    return <RowsListStyled rootLayoutSpans={rootLayoutSpans}>{rows?.map(({ id }) => <Row key={id} id={id} />) || children}</RowsListStyled>
})

RowsList.displayName = 'RowsList'
