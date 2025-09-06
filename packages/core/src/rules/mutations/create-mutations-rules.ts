import { ComponentSchema } from '../../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { MutationRule, MutationRuleExecute, MutationRuleToCreate } from './types'

export function createMutationRule<
    OptsBuilder,
    OptsBuilderOptions extends OptsBuilder extends GroupOptionsBuilder ? OptionsBuilderOutput<OptsBuilder> : unknown,
    CompSchema extends ComponentSchema,
    Execute extends MutationRuleExecute<OptsBuilderOptions, CompSchema> = MutationRuleExecute<OptsBuilderOptions, CompSchema>,
>(params: MutationRuleToCreate<OptsBuilder, Execute>): MutationRule {
    return params as MutationRule
}
