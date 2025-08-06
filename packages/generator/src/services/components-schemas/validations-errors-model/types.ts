import { ComponentValidationError, EntityId } from '@form-crafter/core'

export type ComponentsValidationErrors = Record<EntityId, Map<EntityId, ComponentValidationError>>

export type SetComponentValidationErrorsPayload = { componentId: EntityId; errors: ComponentsValidationErrors[keyof ComponentsValidationErrors] }
