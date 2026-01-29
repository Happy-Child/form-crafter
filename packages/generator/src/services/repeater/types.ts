import { EntityId } from '@form-crafter/core'

export type AddRepeaterGroupPayload = { repeaterId: EntityId }

export type RemoveRepeaterGroupPayload = { repeaterId: EntityId; rowIndex: number }
