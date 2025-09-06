import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type NumberInputComponentProperties = EditableComponentProperties

export type NumberInputComponentSchema<T extends NumberInputComponentProperties = NumberInputComponentProperties> = EditableComponentSchema<'number-input', T>
