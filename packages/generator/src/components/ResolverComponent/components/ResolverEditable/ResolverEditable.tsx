import { useUnit } from 'effector-react'
import { memo } from 'react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverEditable: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'editable'>(id)
    const properties = useComponentProperties<'editable'>(id)

    const { onUpdatePropertiesEvent, onBlurEvent, $error, $errors, $isRequired, $isValidationPending } = useComponentModel<'editable'>(id)
    const [isRequired, error, errors, isValidationPending] = useUnit([$isRequired, $error, $errors, $isValidationPending])

    const { parentId } = useViewComponentWithParent(id)

    const Component = useDisplayComponent<'editable'>(id)

    return (
        <LayoutComponent id={id}>
            <Component
                id={id}
                parentId={parentId}
                rowId={rowId}
                meta={meta}
                properties={properties}
                onChangeProperties={onUpdatePropertiesEvent}
                onBlur={onBlurEvent}
                error={error}
                errors={errors}
                isRequired={isRequired}
                isValidationPending={isValidationPending}
            />
        </LayoutComponent>
    )
})

ResolverEditable.displayName = 'ResolverEditable'
