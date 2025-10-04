import { AvailableObject } from '@form-crafter/utils'

import { ComponentSerializableValue } from '../components'
import { EntityId } from '../types'

export type ConditionOperator = 'and' | 'or' | 'nand' | 'nor'

export type ComponentConditionOperandNode = {
    type: 'component'
    componentId: EntityId
    strategyIfHidden?: 'skip' | 'resolve' | 'reject'
    operatorKey: string
    options?: AvailableObject
    enteredComponentValue?: NonNullable<ComponentSerializableValue>
}

export type ViewConditionOperandNode = {
    type: 'view'
    viewId: EntityId | null
    operatorKey: 'active' | 'notActive'
}

type ConditionOperandNode = ComponentConditionOperandNode | ViewConditionOperandNode

export type ConditionOperatorNode<O extends ConditionOperandNode = ConditionOperandNode> = {
    type: 'operator'
    operator: ConditionOperator
    operands: (ConditionOperatorNode<O> | O)[]
}

export type ValidationConditionNode = ConditionOperatorNode | ConditionOperandNode

export type MutationConditionNode = ConditionOperatorNode | ConditionOperandNode

export type ViewConditionNode = ConditionOperatorNode<ComponentConditionOperandNode> | ComponentConditionOperandNode

export type ConditionNode = ValidationConditionNode | MutationConditionNode | ViewConditionNode
