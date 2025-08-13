import { SelectionOption } from '@form-crafter/core'
import { Maybe, NonUndefinable, Nullable, Undefinable } from '@form-crafter/utils'

import { CustomValidationRuleParams } from '../validations'
import { GeneralOptionBuilder } from './general'

type Properties = {
    label: Undefinable<string>
    value: Undefinable<SelectionOption['value'][]>
    options: SelectionOption[]
    disable: Undefinable<boolean>
    nullable: Undefinable<boolean>
    readonly: Undefinable<boolean>
    helpText: Undefinable<string>
}

const getInitialProperties = (): Properties => ({
    label: undefined,
    value: undefined,
    options: [],
    disable: undefined,
    nullable: undefined,
    readonly: undefined,
    helpText: undefined,
})

export class RadioBuilder<Output extends Maybe<Properties['value']> = Properties['value']> extends GeneralOptionBuilder<Output, Properties> {
    constructor() {
        super({ type: 'radio', properties: getInitialProperties() })
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public value(value: Properties['value']) {
        this.properties.value = value
        return this
    }

    public options(value: Properties['options']) {
        this.properties.options = value
        return this
    }

    public disable(value: Properties['disable']) {
        this.properties.disable = value
        return this
    }

    public readonly(value: Properties['readonly']) {
        this.properties.readonly = value
        return this
    }

    public nullable() {
        this.properties.nullable = true
        return this as RadioBuilder<Nullable<Output>>
    }

    public helpText(value: Properties['helpText']) {
        this.properties.helpText = value
        return this
    }

    public customValidation(params: CustomValidationRuleParams) {
        this.validations.push(params)
        return this
    }

    public required() {
        this.validations.push({ name: 'required' })
        return this as unknown as RadioBuilder<NonUndefinable<Output>>
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

export const radio = () => new RadioBuilder()
