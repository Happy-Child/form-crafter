import { ComponentConditionOperator } from '../../components-operators'
import { GroupOptionsBuilder } from '../../options-builder'
import { ComponentValidationRule, MutationRule } from '../../rules'

export type GeneralComponentModule<O extends GroupOptionsBuilder> = {
    name: string
    label: string
    optionsBuilder: O
}

export type EditableComponentModule<B extends GroupOptionsBuilder> = GeneralComponentModule<B> & {
    operators?: ComponentConditionOperator[]
    validations?: ComponentValidationRule[]
    mutations?: MutationRule[]
}
