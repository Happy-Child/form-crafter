import { DateInputComponentSchema } from './date-input'
import { DatePickerComponentSchema } from './date-picker'
import { DateRangeComponentSchema } from './date-range'
import { MultipleSelectComponentSchema } from './multiple-select'
import { NumberInputComponentSchema } from './number-input'
import { SelectComponentSchema } from './select'
import { TextInputComponentSchema } from './text-input'
import { UploaderComponentSchema } from './uploader'

export * from './date-input'
export * from './date-picker'
export * from './date-range'
export * from './multiple-select'
export * from './number-input'
export * from './select'
export * from './text-input'
export * from './types'
export * from './uploader'

export type EditableComponentSchema =
    | DateInputComponentSchema
    | DatePickerComponentSchema
    | DateRangeComponentSchema
    | MultipleSelectComponentSchema
    | NumberInputComponentSchema
    | SelectComponentSchema
    | TextInputComponentSchema
    | UploaderComponentSchema
