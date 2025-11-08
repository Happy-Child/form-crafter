import { memo } from 'react'

import { useUnit } from 'effector-react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverEditable: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'editable'>(id)
    const properties = useComponentProperties<'editable'>(id)

    const { onUpdateProperties, onBlur, $firstError, $errors, $isRequired } = useComponentModel<'editable'>(id)
    const [isRequired, firstError, errors] = useUnit([$isRequired, $firstError, $errors])

    const { parentRowId } = useViewComponent(id)

    const Component = useDisplayComponent<'editable'>(id)

    return (
        <LayoutComponent id={id}>
            {id}
            <br />
            <Component
                id={id}
                parentId={parentRowId}
                rowId={rowId}
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
