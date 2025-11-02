import { memo } from 'react'

import { useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverStatic: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'static'>(id)
    const properties = useComponentProperties<'static'>(id)

    const { parentRowId } = useViewComponent(id)

    const Component = useDisplayComponent<'static'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentRowId} rowId={rowId} meta={meta} properties={properties} />
        </LayoutComponent>
    )
})

ResolverStatic.displayName = 'ResolverStatic'
