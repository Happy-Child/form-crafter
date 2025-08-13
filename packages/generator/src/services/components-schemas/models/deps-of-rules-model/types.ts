import { EntityId } from '@form-crafter/core'

export type DepsRuleSchema = {
    schemaIdToDeps: Record<EntityId, EntityId[]>
    schemaIdToDependents: Record<EntityId, EntityId[]>
}
