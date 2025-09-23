import { EntityId } from '@form-crafter/core'

export type DepsByValidationRules = {
    ruleIdToDepsComponents: Record<EntityId, EntityId[]>
    componentsToDependentsRuleIds: Record<EntityId, EntityId[]>
}
