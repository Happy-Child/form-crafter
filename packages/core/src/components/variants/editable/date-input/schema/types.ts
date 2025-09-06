import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type DateInputComponentProperties = EditableComponentProperties

export type DateInputComponentSchema<T extends DateInputComponentProperties = DateInputComponentProperties> = EditableComponentSchema<'date-input', T>
