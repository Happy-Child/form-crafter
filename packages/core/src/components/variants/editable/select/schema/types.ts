import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type SelectComponentProperties = EditableComponentProperties

export type SelectComponentSchema<T extends SelectComponentProperties = SelectComponentProperties> = EditableComponentSchema<'select', T>
