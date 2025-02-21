import { ViewRowChild } from '@form-crafter/core'
import { FC, memo, PropsWithChildren } from 'react'

import { Row } from '../Row'
import styles from './styles.module.sass'

export type Props = PropsWithChildren<{
    rows?: ViewRowChild[]
}>

export const RowsList: FC<Props> = memo(({ rows, children }) => {
    return <div className={styles.root}>{rows?.map(({ id }) => <Row key={id} id={id} />) || children}</div>
})

RowsList.displayName = 'RowsList'
