import { useUnit } from 'effector-react'
import { memo } from 'react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverUploader: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'uploader'>(id)
    const properties = useComponentProperties<'uploader'>(id)

    const { onUpdatePropertiesEvent, $isRequired, $firstError, $errors } = useComponentModel<'uploader'>(id)
    const [isRequired, firstError, errors] = useUnit([$isRequired, $firstError, $errors])

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
                firstError={firstError}
                errors={errors}
                isRequired={isRequired}
            />
        </LayoutComponent>
    )
})

ResolverUploader.displayName = 'ResolverUploader'
