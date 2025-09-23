import { ComponentsSchemas, EntityId } from '@form-crafter/core'

import { ComponentToUpdate } from '../components-model'

export type ReadyValidationsRules = Record<EntityId, Set<EntityId>>

export type ReadyValidationsRulesByKey = Record<EntityId, Record<string, Set<EntityId>>>

export type CalcReadyConditionalValidationRulesPayload = {
    newComponentsSchemas: ComponentsSchemas
    componentsToUpdate: ComponentToUpdate[]
    skipIfValueUnchanged?: boolean
}
