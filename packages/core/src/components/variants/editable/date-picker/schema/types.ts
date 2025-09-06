import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type DatePickerComponentProperties = EditableComponentProperties

export type DatePickerComponentSchema<T extends DatePickerComponentProperties = DatePickerComponentProperties> = EditableComponentSchema<'date-picker', T>
