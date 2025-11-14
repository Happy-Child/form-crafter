import { memo } from 'react'

import { useComponentMeta, useComponentProperties, useDisplayComponent, useViewComponent, useViewRow } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverStatic: ResolverComponentType = memo(({ id }) => {
    const meta = useComponentMeta<'static'>(id)
    const properties = useComponentProperties<'static'>(id)

    const { parentRowId } = useViewComponent(id)
    const row = useViewRow(parentRowId)

    const Component = useDisplayComponent<'static'>(id)

    return (
        <LayoutComponent id={id}>
            <Component id={id} row={row} meta={meta} properties={properties} />
        </LayoutComponent>
    )
})

ResolverStatic.displayName = 'ResolverStatic'
