import { memo } from 'react'

import { useChangePropertiesHandler, useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverUploader: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'uploader'>(id)
    const properties = useComponentProperties<'uploader'>(id)

    const { parentId } = useViewComponentWithParent(id)

    const onChangeProperties = useChangePropertiesHandler<'uploader'>(id)

    const Component = useDisplayComponent<'uploader'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} onChangeProperties={onChangeProperties} />
        </LayoutComponent>
    )
})

ResolverUploader.displayName = 'ResolverUploader'
