import { OptionsBuilder } from '@form-crafter/core'
import { OptionalSerializableValue, SomeObject } from '@form-crafter/utils'

import { RelationRule } from '../relations'
import { OptionFieldType } from '../types'
import { ValidationRule } from '../validations'

type GeneralOptionBuilderParams<P extends object> = {
    type: OptionFieldType
    properties: P
}

export class GeneralOptionBuilder<Output extends OptionalSerializableValue, Props extends SomeObject = SomeObject> implements OptionsBuilder<Output> {
    declare readonly __outputType: Output

    public readonly type: string
    public properties: Props
    public validations: ValidationRule[]
    public relations: RelationRule[]

    constructor({ type, properties }: GeneralOptionBuilderParams<Props>) {
        this.type = type
        this.properties = properties
        this.validations = []
        this.relations = []
    }
}
