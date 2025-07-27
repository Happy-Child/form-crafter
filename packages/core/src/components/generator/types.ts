import { OptionalSerializableObject, Unwrap } from '@form-crafter/utils'
import { FC } from 'react'

import { ComponentType, EntityId } from '../../types'
import {
    ContainerComponentProperties,
    EditableComponentProperties,
    RepeaterComponentProperties,
    StaticComponentProperties,
    UploaderComponentProperties,
} from '../../types'
import { ViewComponent, ViewRowChild } from '../../views'
import { ComponentMeta, ValidationRuleSchema } from '../schemas'

export type ComponentValidationError = Pick<ValidationRuleSchema, 'id' | 'ruleName'> & {
    message: string
}

export type GroupValidationError = ComponentValidationError

export type HeaderContainerProps = {
    rows: ViewRowChild[]
}

export type HeaderContainer = FC<HeaderContainerProps>

export type ComponentProperties<T extends ComponentType> = T extends 'editable'
    ? EditableComponentProperties
    : T extends 'container'
      ? ContainerComponentProperties
      : T extends 'repeater'
        ? RepeaterComponentProperties
        : T extends 'uploader'
          ? UploaderComponentProperties
          : T extends 'static'
            ? StaticComponentProperties
            : never

export type GenaralComponentProps<T extends ComponentType, P extends OptionalSerializableObject> = {
    meta: ComponentMeta<T>
    properties: P
    id: EntityId
    parentId: EntityId
    rowId: EntityId
}

export type EditableComponentProps<P extends EditableComponentProperties = EditableComponentProperties> = GenaralComponentProps<'editable', P> & {
    onBlur: () => void
    onChangeProperties: (changes: Partial<P>) => void
    errors: ComponentValidationError[] | null
    error: ComponentValidationError | null
    isRequired: boolean
    isValidationPending: boolean
}

export type ContainerComponentProps<P extends ContainerComponentProperties = ContainerComponentProperties> = GenaralComponentProps<'container', P> & {
    rows?: ViewComponent['rows']
    onChangeProperties: (changes: Partial<P>) => void
}

export type RepeaterComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<'repeater', P> & {
    rows?: ViewComponent['rows']
    onAddRow: () => void
    onRemoveRow: (props: { rowId: EntityId }) => void
    errors: ComponentValidationError[] | null
    error: ComponentValidationError | null
    isRequired: boolean
    isValidationPending: boolean
}

export type UploaderComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<'uploader', P> & {
    onChangeProperties: (changes: Partial<P>) => void
    errors: ComponentValidationError[] | null
    error: ComponentValidationError | null
    isRequired: boolean
    isValidationPending: boolean
}

export type StaticComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<'static', P>

export type EditableComponent<T extends EditableComponentProperties> = FC<Unwrap<EditableComponentProps<T>>>

export type ContainerComponent<T extends ContainerComponentProperties> = FC<Unwrap<ContainerComponentProps<T>>>

export type RepeaterComponent<T extends RepeaterComponentProperties> = FC<Unwrap<RepeaterComponentProps<T>>>

export type UploaderComponent<T extends UploaderComponentProperties> = FC<Unwrap<UploaderComponentProps<T>>>

export type StaticComponent<T extends StaticComponentProperties> = FC<Unwrap<StaticComponentProps<T>>>

// export type FormCrafterComponentProps<T extends ComponentType, S extends ComponentProperties<T>> = T extends 'editable'
//     ? S extends ComponentProperties<T>
//         ? Unwrap<EditableComponentProps<S>>
//         : never
//     : T extends 'container'
//       ? S extends ComponentProperties<T>
//           ? Unwrap<ContainerComponentProps<S>>
//           : never
//       : T extends 'repeater'
//         ? S extends ComponentProperties<T>
//             ? Unwrap<RepeaterComponentProps<S>>
//             : never
//         : T extends 'uploader'
//           ? S extends ComponentProperties<T>
//               ? Unwrap<UploaderComponentProps<S>>
//               : never
//           : T extends 'static'
//             ? S extends ComponentProperties<T>
//                 ? Unwrap<StaticComponentProps<S>>
//                 : never
//             : never

export type FormCrafterComponent<T extends ComponentType, S extends ComponentProperties<T>> = T extends 'editable'
    ? S extends ComponentProperties<'editable'>
        ? EditableComponent<S>
        : never
    : T extends 'container'
      ? S extends ComponentProperties<'container'>
          ? ContainerComponent<S>
          : never
      : T extends 'repeater'
        ? S extends ComponentProperties<'repeater'>
            ? RepeaterComponent<S>
            : never
        : T extends 'uploader'
          ? S extends ComponentProperties<'uploader'>
              ? UploaderComponent<S>
              : never
          : T extends 'static'
            ? S extends ComponentProperties<'static'>
                ? StaticComponent<S>
                : never
            : never
