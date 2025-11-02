import { FC, memo, PropsWithChildren } from 'react'

import { EntityId } from '@form-crafter/core'

import { useRootLayoutSpans, useViewComponent } from '../../hooks'
import { LayoutStyled } from './styles'

type Props = PropsWithChildren<{
    id: EntityId
}>

export const LayoutComponent: FC<Props> = memo(({ id, children }) => {
    const { layout } = useViewComponent(id)

    const rootLayoutSpans = useRootLayoutSpans()

    return (
        <LayoutStyled componentLayout={layout} rootLayoutSpans={rootLayoutSpans}>
            {children}
        </LayoutStyled>
    )
})

LayoutComponent.displayName = 'LayoutComponent'
