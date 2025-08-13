import { OptionBuilderType, OptionsBuilder } from '@form-crafter/core'
import { OptionalSerializableValue, SomeObject } from '@form-crafter/utils'

import { MutationRule } from '../mutations'
import { ValidationRule } from '../validations'

type Params<P extends object> = {
    type: OptionBuilderType
    properties: P
}

export class GeneralOptionBuilder<Output extends OptionalSerializableValue, Props extends SomeObject = SomeObject> implements OptionsBuilder<Output> {
    declare readonly __outputType: Output

    public readonly type: OptionBuilderType
    public properties: Props
    public validations: ValidationRule[]
    public mutations: MutationRule[]

    constructor({ type, properties }: Params<Props>) {
        this.type = type
        this.properties = properties
        this.validations = []
        this.mutations = []
    }
}
