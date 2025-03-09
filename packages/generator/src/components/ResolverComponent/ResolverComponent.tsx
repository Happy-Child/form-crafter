// import { ComponentType } from '@form-crafter/core'
import { memo } from 'react'

import { useComponentMeta, useHasDisplayComponent, useIsHiddenComponent } from '../../hooks'
import { ResolverContainer } from './components/ResolverContainer'
import { ResolverEditable } from './components/ResolverEditable'
import { ResolverRepeater } from './components/ResolverRepeater'
import { ResolverComponentType } from './types'

// Record<ComponentType, ResolverComponentType>
const resolverByType: any = {
    editable: ResolverEditable,
    container: ResolverContainer,
    repeater: ResolverRepeater,
    // uploader: ,
    // static: ,
}

export const ResolverComponent: ResolverComponentType = memo(({ id, rowId }) => {
    const { type } = useComponentMeta(id)
    const isHidden = useIsHiddenComponent(id)

    const Resolver = resolverByType[type]
    const [hasComponent, PlaceholderComponent] = useHasDisplayComponent(id)

    if (isHidden) {
        return null
    }

    return hasComponent ? <Resolver id={id} rowId={rowId} /> : <PlaceholderComponent />
})

ResolverComponent.displayName = 'ResolverComponent'
