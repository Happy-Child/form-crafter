import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

export type MutationsOverridesCache = Record<EntityId, AvailableObject | null>

export type RunMutationsPayload = {
    curComponentsSchemas: ComponentsSchemas
    newComponentsSchemas: ComponentsSchemas
    depsForMutationResolution: EntityId[]
    componentsIdsToUpdate: EntityId[]
}
