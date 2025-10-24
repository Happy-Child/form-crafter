import { ComponentSchema } from '../../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { MutationRollbackStrategies, MutationRule, MutationRuleExecute, MutationRuleToCreate } from './types'

export function createMutationRule<
    OptsBuilder,
    OptsBuilderOptions extends OptsBuilder extends GroupOptionsBuilder ? OptionsBuilderOutput<OptsBuilder> : unknown,
    CompSchema extends ComponentSchema,
    Execute extends MutationRuleExecute<OptsBuilderOptions, CompSchema> = MutationRuleExecute<OptsBuilderOptions, CompSchema>,
    RollbackExecute extends MutationRuleExecute<OptsBuilderOptions, CompSchema> = MutationRuleExecute<OptsBuilderOptions, CompSchema>,
    RollbackStrategies extends MutationRollbackStrategies<RollbackExecute> = MutationRollbackStrategies<RollbackExecute>,
>(params: MutationRuleToCreate<OptsBuilder, Execute, RollbackStrategies>): MutationRule {
    return params as MutationRule
}
