import { AvailableObject, AvailableValue } from '@form-crafter/utils'

export type OptionBuilderType =
    | 'text'
    | 'number'
    | 'date'
    | 'time'
    | 'select'
    | 'multiSelect'
    | 'checkbox'
    | 'multiCheckbox'
    | 'selectComponent'
    | 'selectComponents'
    | 'radio'
    | 'slider'
    | 'datePicker'
    | 'dateRange'
    | 'timePicker'
    | 'multifield'
    | 'group'
    | 'mask'
    | 'textarea'

export interface OptionsBuilder<Output extends AvailableValue = AvailableValue> {
    __outputType: Output
    struct?: Record<string, OptionsBuilder>
    readonly type: OptionBuilderType
    properties: unknown
    validations: unknown[]
    mutations: unknown[]
}

export interface GroupOptionsBuilder<Output extends AvailableObject = AvailableObject> extends OptionsBuilder<Output> {
    struct: Record<string, OptionsBuilder>
}

export interface MultifieldOptionsBuilder<Output extends AvailableObject = AvailableObject> extends OptionsBuilder<Output> {
    properties: {
        template: OptionsBuilder
    }
}

export type OptionsBuilderOutput<T extends OptionsBuilder> = T['__outputType']
