import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

export type RulesOverridesCache = Record<EntityId, AvailableObject | null>

export type RunMutationRulesPayload = {
    curComponentsSchemas: ComponentsSchemas
    newComponentsSchemas: ComponentsSchemas
    depsForMutationResolution: EntityId[]
    componentsIdsToUpdate: EntityId[]
}
