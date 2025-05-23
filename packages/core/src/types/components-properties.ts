import { Nullable, OptionalSerializableObject, OptionalSerializableValue } from '@form-crafter/utils'

export type GeneralComponentProperties = OptionalSerializableObject & { hidden?: boolean }

export type EditableComponentProperties = GeneralComponentProperties & { value: OptionalSerializableValue }

export type ContainerComponentProperties = GeneralComponentProperties & { title?: Nullable<string> }

export type RepeaterComponentProperties = GeneralComponentProperties

export type UploaderComponentProperties = GeneralComponentProperties

export type StaticComponentProperties = GeneralComponentProperties
