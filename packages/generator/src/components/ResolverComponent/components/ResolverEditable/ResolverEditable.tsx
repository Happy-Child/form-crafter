import { useUnit } from 'effector-react'
import { memo } from 'react'

import { useComponentMeta, useComponentModel, useComponentProperties, useDisplayComponent, useViewComponentWithParent } from '../../../../hooks'
import { LayoutComponent } from '../../../LayoutComponent'
import { ResolverComponentType } from '../../types'

export const ResolverEditable: ResolverComponentType = memo(({ id, rowId }) => {
    const meta = useComponentMeta<'editable'>(id)
    const properties = useComponentProperties<'editable'>(id)

    const { onUpdatePropertiesEvent, onBlurEvent, $error, $isRequired } = useComponentModel<'editable'>(id)

    const [isRequired, error] = useUnit([$isRequired, $error])

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
                isRequired={isRequired}
            />
        </LayoutComponent>
    )
})

ResolverEditable.displayName = 'ResolverEditable'
