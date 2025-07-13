import { useUnit } from 'effector-react'
import { memo } from 'react'

import { RepeaterProvider } from '../../../../contexts'
import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'
import { useRepeaterEvents } from './hooks'

export const ResolverRepeater: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'repeater'>(id)
    const properties = useComponentProperties<'repeater'>(id)

    const { parentId, rows } = useViewComponentWithParent(id)

    const { $error } = useComponentModel<'repeater'>(id)
    const error = useUnit($error)

    const events = useRepeaterEvents(id)

    const Component = useDisplayComponent<'repeater'>(id)

    return (
        <LayoutComponent id={id}>
            <RepeaterProvider {...events}>
                <Component {...events} id={id} parentId={parentId} rowId={rowId} meta={meta} properties={properties} rows={rows} error={error} />
            </RepeaterProvider>
        </LayoutComponent>
    )
})

ResolverRepeater.displayName = 'ResolverRepeater'
