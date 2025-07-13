import { ComponentValidationRule, RepeaterValidationRule } from '../types'

export const isRepeaterValidationRule = (rule: ComponentValidationRule): rule is RepeaterValidationRule => rule.type === 'repeater'
