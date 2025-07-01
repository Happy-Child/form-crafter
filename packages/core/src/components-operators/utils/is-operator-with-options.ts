import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions } from '../types'

export const isOperatorWithOptions = (
    operator: ComponentConditionOperator | ComponentConditionOperatorWithoutOptions,
): operator is ComponentConditionOperator => 'options' in operator
