import { ComponentsSchemas, EntityId } from '@form-crafter/core'

export type ReadyValidationsRules = Record<EntityId, Set<EntityId>>

export type ReadyValidationsRulesByRuleName = Record<EntityId, Record<string, Set<EntityId>>>

export type CalcReadyConditionalValidationRulesPayload = {
    componentsSchemasToUpdate: ComponentsSchemas
    skipIfValueUnchanged?: boolean
}
