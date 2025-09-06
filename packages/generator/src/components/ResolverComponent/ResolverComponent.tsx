import { memo } from 'react'

import { ComponentType } from '@form-crafter/core'

import { useComponentMeta, useHasDisplayComponent, useIsHiddenComponent } from '../../hooks'
import { ResolverContainer } from './components/ResolverContainer'
import { ResolverEditable } from './components/ResolverEditable'
import { ResolverRepeater } from './components/ResolverRepeater'
import { ResolverStatic } from './components/ResolverStatic'
import { ResolverComponentType } from './types'

const resolverByType: Record<ComponentType, ResolverComponentType> = {
    'text-input': ResolverEditable,
    'number-input': ResolverEditable,
    'date-input': ResolverEditable,
    'multiple-select': ResolverEditable,
    select: ResolverEditable,
    'date-picker': ResolverEditable,
    'date-range': ResolverEditable,
    uploader: ResolverEditable,
    container: ResolverContainer,
    repeater: ResolverRepeater,
    static: ResolverStatic,
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
