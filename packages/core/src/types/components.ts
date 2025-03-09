import { Nullable, OptionalSerializableObject, OptionalSerializableValue, Unwrap } from '@form-crafter/utils'
import { FC } from 'react'

import { ComponentMeta } from './components-schemas'
import { ComponentType, EntityId } from './general'
import { ViewComponent, ViewRowChild } from './views'

export type HeaderContainerProps = {
    rows: ViewRowChild[]
}

export type HeaderContainer = FC<HeaderContainerProps>

export type EditableComponentProperties = OptionalSerializableObject & { value: OptionalSerializableValue }

export type ContainerComponentProperties = OptionalSerializableObject & { title?: Nullable<string> }

export type RepeaterComponentProperties = OptionalSerializableObject

export type UploaderComponentProperties = OptionalSerializableObject

export type StaticComponentProperties = OptionalSerializableObject

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
    onChangeProperties: (changes: Partial<P>) => void
}

export type ContainerComponentProps<P extends ContainerComponentProperties = ContainerComponentProperties> = GenaralComponentProps<'container', P> & {
    rows?: ViewComponent['rows']
    onChangeProperties: (changes: Partial<P>) => void
}

export type RepeaterComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<'repeater', P> & {
    rows?: ViewComponent['rows']
    onChangeProperties: (changes: Partial<P>) => void
    onAddRow: () => void
    onRemoveRow: (props: { rowId: EntityId }) => void
}

export type UploaderComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<'uploader', P> & {
    onChangeProperties: (changes: Partial<P>) => void
}

export type StaticComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<'static', P>

export type FormCrafterComponentProps<T extends ComponentType, S extends ComponentProperties<T>> = T extends 'editable'
    ? S extends ComponentProperties<T>
        ? Unwrap<EditableComponentProps<S>>
        : never
    : T extends 'container'
      ? S extends ComponentProperties<T>
          ? Unwrap<ContainerComponentProps<S>>
          : never
      : T extends 'repeater'
        ? S extends ComponentProperties<T>
            ? Unwrap<RepeaterComponentProps<S>>
            : never
        : T extends 'uploader'
          ? S extends ComponentProperties<T>
              ? Unwrap<UploaderComponentProps<S>>
              : never
          : T extends 'static'
            ? S extends ComponentProperties<T>
                ? Unwrap<StaticComponentProps<S>>
                : never
            : never

export type EditableComponent<T extends ComponentProperties<'editable'>> = FC<Unwrap<EditableComponentProps<T>>>

export type ContainerComponent<T extends ComponentProperties<'container'>> = FC<Unwrap<ContainerComponentProps<T>>>

export type RepeaterComponent<T extends ComponentProperties<'repeater'>> = FC<Unwrap<RepeaterComponentProps<T>>>

export type UploaderComponent<T extends ComponentProperties<'uploader'>> = FC<Unwrap<UploaderComponentProps<T>>>

export type StaticComponent<T extends ComponentProperties<'static'>> = FC<Unwrap<StaticComponentProps<T>>>

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
