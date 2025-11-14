import { memo } from 'react'

import { useUnit } from 'effector-react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponent, useViewRow } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverEditable: ResolverComponentType = memo(({ id }) => {
    const meta = useComponentMeta<'editable'>(id)
    const properties = useComponentProperties<'editable'>(id)

    const { onUpdateProperties, onBlur, $firstError, $errors, $isRequired } = useComponentModel<'editable'>(id)
    const [isRequired, firstError, errors] = useUnit([$isRequired, $firstError, $errors])

    const { parentRowId } = useViewComponent(id)
    const row = useViewRow(parentRowId)

    const Component = useDisplayComponent<'editable'>(id)

    return (
        <LayoutComponent id={id}>
            <Component
                id={id}
                row={row}
                meta={meta}
                properties={properties}
                onChangeProperties={onUpdateProperties}
                onBlur={onBlur}
                firstError={firstError}
                errors={errors}
                isRequired={isRequired}
            />
        </LayoutComponent>
    )
})

ResolverEditable.displayName = 'ResolverEditable'
