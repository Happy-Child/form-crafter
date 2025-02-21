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

export class MultiCheckboxBuilder<Output extends Maybe<Properties['value']> = Properties['value']> extends GeneralOptionBuilder<Output, Properties> {
    constructor() {
        super({ type: 'multiCheckbox', properties: getInitialProperties() })
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public checked(value: Properties['value']) {
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
        return this as MultiCheckboxBuilder<Nullable<Output>>
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
        return this as unknown as MultiCheckboxBuilder<NonUndefinable<Output>>
    }

    public minSelections(min: number) {
        this.validations.push({ name: 'minSelections', params: { min } })
        return this
    }

    public maxSelections(max: number) {
        this.validations.push({ name: 'maxSelections', params: { max } })
        return this
    }

    public hideIf() {
        this.relations.push({ name: 'hideIf' })
        return this
    }

    public disableIf() {
        this.relations.push({ name: 'disableIf' })
        return this
    }
}

export const miltiCheckbox = () => new MultiCheckboxBuilder()
