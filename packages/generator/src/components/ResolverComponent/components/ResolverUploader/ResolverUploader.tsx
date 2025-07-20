import { useUnit } from 'effector-react'
import { memo } from 'react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverUploader: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'uploader'>(id)
    const properties = useComponentProperties<'uploader'>(id)

    const { onUpdatePropertiesEvent, $isRequired, $error, $errors, $isValidationPending } = useComponentModel<'uploader'>(id)
    const [isRequired, error, errors, isValidationPending] = useUnit([$isRequired, $error, $errors, $isValidationPending])

    const { parentId } = useViewComponentWithParent(id)

    const Component = useDisplayComponent<'uploader'>(id)

    return (
        <LayoutComponent id={id}>
            <Component
                id={id}
                parentId={parentId}
                rowId={rowId}
                meta={meta}
                properties={properties}
                onChangeProperties={onUpdatePropertiesEvent}
                error={error}
                errors={errors}
                isRequired={isRequired}
                isValidationPending={isValidationPending}
            />
        </LayoutComponent>
    )
})

ResolverUploader.displayName = 'ResolverUploader'
