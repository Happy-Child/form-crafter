import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type DateRangeComponentProperties = EditableComponentProperties

export type DateRangeComponentSchema<T extends DateRangeComponentProperties = DateRangeComponentProperties> = EditableComponentSchema<'date-range', T>
