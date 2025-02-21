import { Maybe, NonUndefinable, Nullable, Undefinable } from '@form-crafter/utils'

import { CustomValidationRuleParams } from '../validations'
import { GeneralOptionBuilder } from './general'

type Properties = {
    label: Undefinable<string>
    value: Undefinable<string | number>
    min: Undefinable<string | Date | number>
    max: Undefinable<string | Date | number>
    pattern: Undefinable<string>
    disable: Undefinable<boolean>
    nullable: Undefinable<boolean>
    readonly: Undefinable<boolean>
    placeholder: Undefinable<string>
    helpText: Undefinable<string>
}

const getInitialProperties: () => Properties = () => ({
    label: undefined,
    value: undefined,
    min: undefined,
    max: undefined,
    pattern: undefined,
    disable: undefined,
    nullable: undefined,
    readonly: undefined,
    placeholder: undefined,
    helpText: undefined,
})

export class DatePickerBuilder<Output extends Maybe<Properties['value']> = Properties['value']> extends GeneralOptionBuilder<Output, Properties> {
    constructor() {
        super({ type: 'datePicker', properties: getInitialProperties() })
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public value(value: Properties['value']) {
        this.properties.value = value
        return this
    }

    public min(value: Properties['min']) {
        this.properties.min = value
        return this
    }

    public max(value: Properties['max']) {
        this.properties.max = value
        return this
    }

    public pattern(value: Properties['pattern']) {
        this.properties.pattern = value
        return this
    }

    public disable() {
        this.properties.disable = true
        return this
    }

    public nullable() {
        this.properties.nullable = true
        return this as DatePickerBuilder<Nullable<Output>>
    }

    public readonly(value: Properties['readonly']) {
        this.properties.readonly = value
        return this
    }

    public placeholder(value: Properties['placeholder']) {
        this.properties.placeholder = value
        return this
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
        return this as unknown as DatePickerBuilder<NonUndefinable<Output>>
    }

    public minDate(minDate: NonNullable<Properties['min']>) {
        this.validations.push({ name: 'minDate', params: { minDate } })
        return this
    }

    public maxDate(maxDate: NonNullable<Properties['max']>) {
        this.validations.push({ name: 'maxDate', params: { maxDate } })
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

export const datePicker = () => new DatePickerBuilder()
