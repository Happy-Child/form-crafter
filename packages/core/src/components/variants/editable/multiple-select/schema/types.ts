import { EditableComponentProperties, EditableComponentSchema } from '../../types'

export type MultipleSelectComponentProperties = EditableComponentProperties

export type MultipleSelectComponentSchema<T extends MultipleSelectComponentProperties = MultipleSelectComponentProperties> = EditableComponentSchema<
    'multiple-select',
    T
>
