import { ViewRowChild } from '@form-crafter/core'
import { FC, memo } from 'react'

import { useViewRow } from '../../hooks'
import { ResolverComponent } from '../ResolverComponent'
import styles from './styles.module.sass'

type Props = ViewRowChild

export const Row: FC<Props> = memo(({ id: rowId }) => {
    const viewRow = useViewRow(rowId)

    return (
        <div className={styles.root}>
            {viewRow.children.map(({ id: componentId }) => (
                <ResolverComponent key={componentId} id={componentId} rowId={rowId} />
            ))}
        </div>
    )
})

Row.displayName = 'Row'
