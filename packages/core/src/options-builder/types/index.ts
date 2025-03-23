import { OptionalSerializableValue } from '@form-crafter/utils'

export interface OptionsBuilder<Output extends OptionalSerializableValue = OptionalSerializableValue> {
    __outputType: Output
}

export type OptionsBuilderOutput<T extends OptionsBuilder> = T['__outputType']
