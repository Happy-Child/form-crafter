import { EntityId, ValidationRuleSchema } from '@form-crafter/core'

export type ComponentsValidationRuleSchemas = Record<EntityId, { ownerComponentId: EntityId; schema: ValidationRuleSchema }>
