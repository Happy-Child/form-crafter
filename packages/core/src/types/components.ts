import { Nullable, OptionalSerializableObject, OptionalSerializableValue, Unwrap } from '@form-crafter/utils'
import { FC } from 'react'

import { ComponentMeta } from './components-schemas'
import { ComponentType, EntityId } from './general'
import { ViewComponent, ViewRowChild } from './views'

export type HeaderContainerProps = {
    rows: ViewRowChild[]
}

export type HeaderContainer = FC<HeaderContainerProps>

export type GenaralComponentProps<T extends ComponentType, P extends OptionalSerializableObject> = {
    meta: ComponentMeta<T>
    properties: P
    onChangeProperties: (changes: Partial<P>) => void
    id: EntityId
    parentId: EntityId
    rowId: EntityId
}

export type BaseComponentProperties = OptionalSerializableObject & { value: OptionalSerializableValue }

export type ContainerComponentProperties = OptionalSerializableObject & { title?: Nullable<string> }

export type ComponentProperties<T extends ComponentType> = T extends 'base'
    ? BaseComponentProperties
    : T extends 'container'
      ? ContainerComponentProperties
      : OptionalSerializableObject

export type BaseComponentProps<P extends BaseComponentProperties = BaseComponentProperties> = GenaralComponentProps<'base', P>

export type ContainerComponentProps<P extends ContainerComponentProperties = ContainerComponentProperties> = GenaralComponentProps<'container', P> & {
    rows?: ViewComponent['rows']
}

export type DynamicContainerComponentProps<P extends OptionalSerializableObject = OptionalSerializableObject> = GenaralComponentProps<
    'dynamic-container',
    P
> & {
    rows?: ViewComponent['rows']
    onAddRow: () => void
    onRemoveRow: (props: { rowId: EntityId }) => void
}

export type FormCrafterComponentProps<T extends ComponentType, S extends ComponentProperties<T>> = T extends 'base'
    ? S extends ComponentProperties<T>
        ? Unwrap<BaseComponentProps<S>>
        : never
    : T extends 'container'
      ? S extends ComponentProperties<T>
          ? Unwrap<ContainerComponentProps<S>>
          : never
      : S extends ComponentProperties<T>
        ? Unwrap<DynamicContainerComponentProps<S>>
        : never

export type BaseComponent<T extends ComponentProperties<'base'>> = FC<Unwrap<BaseComponentProps<T>>>

export type ContainerComponent<T extends ComponentProperties<'container'>> = FC<Unwrap<ContainerComponentProps<T>>>

export type DynamicContainerComponent<T extends ComponentProperties<'dynamic-container'>> = FC<Unwrap<DynamicContainerComponentProps<T>>>

export type FormCrafterComponent<T extends ComponentType, S extends ComponentProperties<T>> = T extends 'base'
    ? S extends ComponentProperties<'base'>
        ? BaseComponent<S>
        : never
    : T extends 'container'
      ? S extends ComponentProperties<'container'>
          ? ContainerComponent<S>
          : never
      : S extends ComponentProperties<'dynamic-container'>
        ? DynamicContainerComponent<S>
        : never
