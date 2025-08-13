import { EntityId } from '@form-crafter/core'
import { Maybe, NonUndefinable, Nullable, Undefinable } from '@form-crafter/utils'

import { CustomValidationRuleParams } from '../validations'
import { GeneralOptionBuilder } from './general'

type Properties = {
    label: Undefinable<string>
    value: Undefinable<EntityId[]>
    disable: Undefinable<boolean>
    nullable: Undefinable<boolean>
    readonly: Undefinable<boolean>
    placeholder: Undefinable<string>
    helpText: Undefinable<string>
    withTemplates: Undefinable<boolean>
    onlyTemplates: Undefinable<boolean>
}

const getInitialProperties: () => Properties = () => ({
    label: undefined,
    value: undefined,
    options: [],
    disable: undefined,
    nullable: undefined,
    readonly: undefined,
    placeholder: undefined,
    helpText: undefined,
    withTemplates: undefined,
    onlyTemplates: undefined,
})

export class SelectComponentsBuilder<Output extends Maybe<Properties['value']> = Properties['value']> extends GeneralOptionBuilder<Output, Properties> {
    constructor() {
        super({ type: 'selectComponents', properties: getInitialProperties() })
    }

    public label(value: Properties['label']) {
        this.properties.label = value
        return this
    }

    public value(value: Properties['value']) {
        this.properties.value = value
        return this
    }

    public disable() {
        this.properties.disable = true
        return this
    }

    public nullable() {
        this.properties.nullable = true
        return this as SelectComponentsBuilder<Nullable<Output>>
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

    public withTemplates(value: Properties['withTemplates']) {
        this.properties.withTemplates = value
        return this
    }

    public onlyTemplates(value: Properties['onlyTemplates']) {
        this.properties.onlyTemplates = value
        return this
    }

    public customValidation(params: CustomValidationRuleParams) {
        this.validations.push(params)
        return this
    }

    public required() {
        this.validations.push({ name: 'required' })
        return this as unknown as SelectComponentsBuilder<NonUndefinable<Output>>
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
        this.mutations.push({ name: 'hideIf' })
        return this
    }

    public disableIf() {
        this.mutations.push({ name: 'disableIf' })
        return this
    }
}

export const selectComponents = () => new SelectComponentsBuilder()
