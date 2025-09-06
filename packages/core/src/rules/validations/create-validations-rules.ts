import { ComponentSchema } from '../../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import {
    ComponentValidationRule,
    ComponentValidationRuleToCreate,
    ComponentValidationRuleValidate,
    GroupValidationRule,
    GroupValidationRuleToCreate,
    GroupValidationRuleValidate,
} from './types'

export function createComponentValidationRule<
    OptsBuilder,
    OptsBuilderOptions extends OptsBuilder extends GroupOptionsBuilder ? OptionsBuilderOutput<OptsBuilder> : unknown,
    CompSchema extends ComponentSchema,
    Validate extends ComponentValidationRuleValidate<OptsBuilderOptions, CompSchema> = ComponentValidationRuleValidate<OptsBuilderOptions, CompSchema>,
>(params: ComponentValidationRuleToCreate<OptsBuilder, Validate>): ComponentValidationRule {
    return { ...params, type: 'component' } as ComponentValidationRule
}

export function createGroupValidationRule<
    OptsBuilder,
    OptsBuilderOptions extends OptsBuilder extends GroupOptionsBuilder ? OptionsBuilderOutput<OptsBuilder> : unknown,
    Validate extends GroupValidationRuleValidate<OptsBuilderOptions> = GroupValidationRuleValidate<OptsBuilderOptions>,
>(params: GroupValidationRuleToCreate<OptsBuilder, Validate>): GroupValidationRule {
    return { ...params, type: 'group' } as GroupValidationRule
}
