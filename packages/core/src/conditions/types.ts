import { AvailableObject } from '@form-crafter/utils'

import { ComponentSerializableValue } from '../components'
import { EntityId } from '../types'

export type ConditionOperator = 'and' | 'or' | 'nand' | 'nor'

export type ConditionOperatorNode = {
    type: 'operator'
    operator: ConditionOperator
    operands: ConditionNode[]
}

type ConditionComponentNodeMeta = {
    id: EntityId
    template?: {
        operator?: ConditionOperator
    }
}

type GeneralConditionComponentNode = {
    type: 'component'
    meta: ConditionComponentNodeMeta
    strategyIfHidden?: 'skip' | 'resolve' | 'reject'
    operator: { key: string }
}

// type GeneralConditionComponentNode = {
//     type: 'component'
//     componentId: EntityId
//     strategyIfHidden?: 'skip' | 'resolve' | 'reject'
//     operatorKey: string
// }

export type ConditionComponentNode =
    | GeneralConditionComponentNode
    | (GeneralConditionComponentNode & {
          options: AvailableObject
      })
    | (GeneralConditionComponentNode & {
          enteredComponentValue: NonNullable<ComponentSerializableValue>
      })
    | (GeneralConditionComponentNode & {
          options: AvailableObject
          enteredComponentValue: NonNullable<ComponentSerializableValue>
      })

export type ConditionNode = ConditionComponentNode | ConditionOperatorNode
