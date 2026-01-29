import { EntityId, Schema, ValidationRuleSchema } from '@form-crafter/core'

export type GroupValidationRuleSchemas = Record<EntityId, ValidationRuleSchema>

export type SchemaServiceParams = {
    schema: Schema
}
