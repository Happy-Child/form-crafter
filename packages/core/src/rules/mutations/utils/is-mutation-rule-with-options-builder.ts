import { MutationRule, MutationRuleWithOptionsBuilder } from '../types'

export const isMutationRuleWithOptionsBuilder = (rule: MutationRule): rule is MutationRuleWithOptionsBuilder => 'optionsBuilder' in rule
