import { EntityId } from '@form-crafter/core'

export type ComponentsTemplates = {
    componentIdToTemplateId: Record<EntityId, EntityId>
    templateIdToComponentsIds: Record<EntityId, Set<EntityId>>
}
