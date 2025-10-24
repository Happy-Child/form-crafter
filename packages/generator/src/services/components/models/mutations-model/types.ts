import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

export type MutationsCache = Record<EntityId, AvailableObject | null>

export type RunMutationsPayload = {
    curComponentsSchemas: ComponentsSchemas
    newComponentsSchemas: ComponentsSchemas
    depsForMutationsResolution: EntityId[]
    componentsIdsToUpdate: EntityId[]
}
