import { OptionalSerializableObject } from '@form-crafter/utils'

import { EntityId } from '../types'

export type ConditionOperator = 'and' | 'or' | 'nand' | 'nor'

export type ConditionOperatorNode = {
    type: 'operator'
    operator: ConditionOperator
    operands: ConditionNode[]
}

export type ConditionComponentNode = {
    type: 'component'
    componentId: EntityId
    operatorName: string
    options?: OptionalSerializableObject
}

export type ConditionComponentNodeWithOptions = Omit<ConditionComponentNode, 'options'> & {
    options: OptionalSerializableObject
}

export type ConditionNode = ConditionComponentNode | ConditionOperatorNode
