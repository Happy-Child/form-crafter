import { memo } from 'react'

import { useChangePropertiesHandler, useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../../ResolverComponent/types'

export const ResolverBase: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'base'>(id)
    const properties = useComponentProperties<'base'>(id)

    const { parentId } = useViewComponentWithParent(id)

    const onChangeProperties = useChangePropertiesHandler<'base'>(id)

    const Component = useDisplayComponent<'base'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} onChangeProperties={onChangeProperties} />
        </LayoutComponent>
    )
})

ResolverBase.displayName = 'ResolverBase'
