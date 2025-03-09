import { memo } from 'react'

import { useChangePropertiesHandler, useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverEditable: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'editable'>(id)
    const properties = useComponentProperties<'editable'>(id)

    const { parentId } = useViewComponentWithParent(id)

    const onChangeProperties = useChangePropertiesHandler<'editable'>(id)

    const Component = useDisplayComponent<'editable'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} onChangeProperties={onChangeProperties} />
        </LayoutComponent>
    )
})

ResolverEditable.displayName = 'ResolverEditable'
