import { AvailableObject } from '@form-crafter/utils'

import { ComponentSerializableValue } from '../components'
import { EntityId } from '../types'

export type ConditionOperator = 'and' | 'or' | 'nand' | 'nor'

export type ConditionOperatorNode = {
    type: 'operator'
    operator: ConditionOperator
    operands: ConditionNode[]
}

type GeneralConditionComponentNode = {
    type: 'component'
    componentId: EntityId
    operatorKey: string
}

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
