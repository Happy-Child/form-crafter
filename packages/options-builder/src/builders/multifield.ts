import { OptionsBuilder } from '@form-crafter/core'
import { AvailableValue, ChildType, NonUndefinable, Undefinable } from '@form-crafter/utils'

import { CustomValidationRuleParams, LengthValidationRuleParams } from '../validations'
import { GeneralOptionBuilder } from './general'

type Properties<T extends Undefinable<AvailableValue[]> = []> = {
    label: Undefinable<string>
    value: Undefinable<T>
    template: Undefinable<OptionsBuilder>
    disable: Undefinable<boolean>
    addButtonName: Undefinable<string>
}

const getInitialProperties: <T extends Undefinable<AvailableValue[]> = []>() => Properties<T> = () => ({
    label: undefined,
    value: undefined,
    template: undefined,
    disable: undefined,
    addButtonName: 'Add',
})

export class MultifieldBuilder<Output extends Undefinable<AvailableValue[]>> extends GeneralOptionBuilder<Output, Properties<Output>> {
    constructor(templateSchema: OptionsBuilder<ChildType<Output>>) {
        super({ type: 'multifield', properties: getInitialProperties<Output>() })
        this.properties.template = templateSchema
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public value(value: Output) {
        this.properties.value = value
        return this
    }

    public disable() {
        this.properties.disable = true
        return this
    }

    public customValidation(params: CustomValidationRuleParams) {
        this.validations.push(params)
        return this
    }

    public required() {
        this.validations.push({ name: 'required' })
        return this as unknown as MultifieldBuilder<NonUndefinable<Output>>
    }

    public length(params: LengthValidationRuleParams) {
        this.validations.push({ name: 'length', params })
        return this
    }

    public unique(params: { uniquekey: keyof ChildType<Output> }) {
        this.validations.push({ name: 'unique', params })
        return this
    }

    public hideIf() {
        this.mutations.push({ name: 'hideIf' })
        return this
    }

    public disableIf() {
        this.mutations.push({ name: 'disableIf' })
        return this
    }
}

export const multifield = <T extends OptionsBuilder>(struct: T) => {
    return new MultifieldBuilder<Undefinable<T['__outputType'][]>>(struct)
}
