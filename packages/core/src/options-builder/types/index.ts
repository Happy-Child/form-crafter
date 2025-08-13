import { OptionalSerializableObject, OptionalSerializableValue } from '@form-crafter/utils'

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

export interface OptionsBuilder<Output extends OptionalSerializableValue = OptionalSerializableValue> {
    __outputType: Output
    struct?: Record<string, OptionsBuilder>
    readonly type: OptionBuilderType
    properties: unknown
    validations: unknown[]
    mutations: unknown[]
}

export interface GroupOptionsBuilder<Output extends OptionalSerializableObject = OptionalSerializableObject> extends OptionsBuilder<Output> {
    struct: Record<string, OptionsBuilder>
}

export interface MultifieldOptionsBuilder<Output extends OptionalSerializableObject = OptionalSerializableObject> extends OptionsBuilder<Output> {
    properties: {
        template: Record<string, OptionsBuilder>
    }
}

export type OptionsBuilderOutput<T extends OptionsBuilder> = T['__outputType']
