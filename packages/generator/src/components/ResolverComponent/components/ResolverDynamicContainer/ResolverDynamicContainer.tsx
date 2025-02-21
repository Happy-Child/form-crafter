import { memo } from 'react'

import { LayoutComponent } from '../../../../components/LayoutComponent'
import { ResolverComponentType } from '../../../../components/ResolverComponent/types'
import { DynamicContainerProvider } from '../../../../contexts'
import { useChangePropertiesHandler, useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { useDynamicContainerEvents } from './hooks'

export const ResolverDynamicContainer: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'dynamic-container'>(id)
    const properties = useComponentProperties<'dynamic-container'>(id)
    const { parentId, rows } = useViewComponentWithParent(id)

    const onChangeProperties = useChangePropertiesHandler<'dynamic-container'>(id)
    const events = useDynamicContainerEvents(id)

    const Component = useDisplayComponent<'dynamic-container'>(id)

    return (
        <LayoutComponent id={id}>
            <DynamicContainerProvider {...events}>
                <Component
                    {...events}
                    id={id}
                    parentId={parentId}
                    rowId={rowId}
                    meta={meta}
                    properties={properties}
                    rows={rows}
                    onChangeProperties={onChangeProperties}
                />
            </DynamicContainerProvider>
        </LayoutComponent>
    )
})

ResolverDynamicContainer.displayName = 'ResolverDynamicContainer'
