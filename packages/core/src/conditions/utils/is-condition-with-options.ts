import { ConditionComponentNodeWithOptions, ConditionNode } from '..'

export const isConditionWithOptions = (condition: ConditionNode): condition is ConditionComponentNodeWithOptions => 'options' in condition
