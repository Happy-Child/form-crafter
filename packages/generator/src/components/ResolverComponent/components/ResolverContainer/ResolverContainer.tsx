import { memo } from 'react'

import { LayoutComponent } from '../../../../components/LayoutComponent'
import { ResolverComponentType } from '../../../../components/ResolverComponent/types'
import { useChangePropertiesHandler, useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'

export const ResolverContainer: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'container'>(id)
    const properties = useComponentProperties<'container'>(id)
    const { parentId, rows } = useViewComponentWithParent(id)

    const onChangeProperties = useChangePropertiesHandler<'container'>(id)

    const Component = useDisplayComponent<'container'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} rows={rows} onChangeProperties={onChangeProperties} />
        </LayoutComponent>
    )
})

ResolverContainer.displayName = 'ResolverContainer'
