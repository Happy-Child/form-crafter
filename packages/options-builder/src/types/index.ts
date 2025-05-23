import { OptionsBuilder, OptionsBuilderOutput } from '@form-crafter/core'
import { MakeKeysOptional, OptionalSerializableObject, SomeObject, Undefinable } from '@form-crafter/utils'

export type GroupStruct = Record<string, OptionsBuilder>

// TODO rename type
export type OutputFromGroupStruct<T extends GroupStruct> = MakeKeysOptional<{
    [K in keyof T]: OptionsBuilderOutput<T[K]>
}>

// TODO rename type
export type GroupStructFromOutput<T extends Undefinable<OptionalSerializableObject>> = T extends OptionalSerializableObject
    ? {
          [K in keyof T]: OptionsBuilder<T[K]>
      }
    : SomeObject
