import { EntityId } from '@form-crafter/core'

export type AddGroupPayload = { repeaterId: EntityId }

export type RemoveGroupPayload = { repeaterId: EntityId; rowIndex: number }
