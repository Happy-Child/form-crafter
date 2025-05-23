import { memo } from 'react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverUploader: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'uploader'>(id)
    const properties = useComponentProperties<'uploader'>(id)
    const { onUpdatePropertiesEvent } = useComponentModel<'uploader'>(id)

    const { parentId } = useViewComponentWithParent(id)

    const Component = useDisplayComponent<'uploader'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} onChangeProperties={onUpdatePropertiesEvent} />
        </LayoutComponent>
    )
})

ResolverUploader.displayName = 'ResolverUploader'
