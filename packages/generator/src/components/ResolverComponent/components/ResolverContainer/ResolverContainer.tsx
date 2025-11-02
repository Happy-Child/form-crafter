import { memo } from 'react'

import { LayoutComponent } from '../../../../components/LayoutComponent'
import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponent } from '../../../../hooks'
import { ResolverComponentType } from '../../types'

export const ResolverContainer: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'container'>(id)
    const properties = useComponentProperties<'container'>(id)

    const { onUpdateProperties } = useComponentModel<'container'>(id)

    const { parentRowId, childrenRows } = useViewComponent(id)

    const Component = useDisplayComponent<'container'>(id)

    return (
        <LayoutComponent id={id}>
            <Component
                id={id}
                parentId={parentRowId}
                rowId={rowId}
                meta={meta}
                onChangeProperties={onUpdateProperties}
                properties={properties}
                childrenRows={childrenRows}
            />
        </LayoutComponent>
    )
})

ResolverContainer.displayName = 'ResolverContainer'
