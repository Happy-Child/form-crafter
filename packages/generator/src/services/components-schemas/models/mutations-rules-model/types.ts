import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'

export type RulesOverridesCache = Record<EntityId, OptionalSerializableObject | null>

export type RunMutationRulesPayload = {
    curComponentsSchemas: ComponentsSchemas
    newComponentsSchemas: ComponentsSchemas
    mutationsDependents: EntityId[]
    componentsIdsToUpdate: EntityId[]
}
