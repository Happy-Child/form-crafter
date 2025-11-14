import { memo } from 'react'

import { useUnit } from 'effector-react'

import { RepeaterProvider } from '../../../../contexts'
import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponent, useViewRow } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'
import { useRepeaterEvents } from './hooks'

export const ResolverRepeater: ResolverComponentType = memo(({ id }) => {
    const meta = useComponentMeta<'repeater'>(id)
    const properties = useComponentProperties<'repeater'>(id)

    const { parentRowId, childrenRows } = useViewComponent(id)
    const row = useViewRow(parentRowId)

    const { $firstError, $errors, $isRequired } = useComponentModel<'repeater'>(id)
    const [firstError, errors, isRequired] = useUnit([$firstError, $errors, $isRequired])

    const events = useRepeaterEvents(id)

    const Component = useDisplayComponent<'repeater'>(id)

    return (
        <LayoutComponent id={id}>
            <RepeaterProvider {...events}>
                <Component
                    {...events}
                    id={id}
                    row={row}
                    meta={meta}
                    properties={properties}
                    childrenRows={childrenRows}
                    firstError={firstError}
                    errors={errors}
                    isRequired={isRequired}
                />
            </RepeaterProvider>
        </LayoutComponent>
    )
})

ResolverRepeater.displayName = 'ResolverRepeater'
