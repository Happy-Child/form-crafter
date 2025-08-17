import { EntityId } from '@form-crafter/core'

import { ComponentToUpdate } from '../components-model'

export type ReadyValidationsRules = Record<EntityId, Set<EntityId>>

export type ReadyValidationsRulesByRuleName = Record<EntityId, Record<string, Set<EntityId>>>

export type CalcReadyConditionalValidationRulesPayload = {
    componentsToUpdate: ComponentToUpdate[]
    skipIfValueUnchanged?: boolean
}
