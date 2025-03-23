import { memo } from 'react'

import { useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverStatic: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'static'>(id)
    const properties = useComponentProperties<'static'>(id)

    const { parentId } = useViewComponentWithParent(id)

    const Component = useDisplayComponent<'static'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} />
        </LayoutComponent>
    )
})

ResolverStatic.displayName = 'ResolverStatic'
