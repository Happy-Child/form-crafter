import { OptionsBuilder, OptionsBuilderOutput } from '@form-crafter/core'
import { MakeKeysOptional, OptionalSerializableObject, SomeObject, Undefinable } from '@form-crafter/utils'

export type OptionFieldType =
    | 'input'
    | 'number'
    | 'date'
    | 'time'
    | 'select'
    | 'multiSelect'
    | 'checkbox'
    | 'multiCheckbox'
    | 'radio'
    | 'slider'
    | 'datePicker'
    | 'dateRange'
    | 'timePicker'
    | 'multifield'
    | 'group'
    | 'mask'
    | 'textarea'

export type GroupStruct = Record<string, OptionsBuilder>

// TODO fucking incomprehensible names
export type OutputFromGroupStruct<T extends GroupStruct> = MakeKeysOptional<{
    [K in keyof T]: OptionsBuilderOutput<T[K]>
}>

// TODO fucking incomprehensible names
export type GroupStructFromOutput<T extends Undefinable<OptionalSerializableObject>> = T extends OptionalSerializableObject
    ? {
          [K in keyof T]: OptionsBuilder<T[K]>
      }
    : SomeObject
