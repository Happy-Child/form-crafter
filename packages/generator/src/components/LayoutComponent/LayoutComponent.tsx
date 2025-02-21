import { EntityId, ViewComponentLayout } from '@form-crafter/core'
import { FC, memo, PropsWithChildren } from 'react'

import { useViewComponentLayout } from '../../hooks'
import { getResponsiveLayoutSizes, getStyles } from '../../utils'
import styles from './styles.module.sass'

const getStyleVariables = ({ col }: ViewComponentLayout) => {
    const finalCol = getResponsiveLayoutSizes(col)
    return getStyles({
        '--colDefault': finalCol.default,
        '--colXxl': finalCol.xxl,
        '--colXl': finalCol.xl,
        '--colLg': finalCol.lg,
        '--colMd': finalCol.md,
        '--colSm': finalCol.sm,
    })
}

type Props = PropsWithChildren<{
    id: EntityId
}>

export const LayoutComponent: FC<Props> = memo(({ id, children }) => {
    const layout = useViewComponentLayout(id)

    const style = getStyleVariables(layout)

    return (
        <div className={styles.root} style={style}>
            {children}
        </div>
    )
})

LayoutComponent.displayName = 'LayoutComponent'
