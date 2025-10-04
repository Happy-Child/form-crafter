import { EntityId } from '@form-crafter/core'

export type DepsGraph = Record<EntityId, EntityId[]>

export type DepsGraphAsSet = Record<EntityId, Set<EntityId>>
