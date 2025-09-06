import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type TextInputComponentProperties = EditableComponentProperties

export type TextInputComponentSchema<T extends TextInputComponentProperties = TextInputComponentProperties> = EditableComponentSchema<'text-input', T>
