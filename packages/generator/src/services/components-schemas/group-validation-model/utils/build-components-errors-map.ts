import { ComponentValidationError, EntityId } from '@form-crafter/core'

import { ComponentsValidationErrors } from '../../types'

export const buildComponentsErrorsMap = (componentsValidationErrors: ComponentsValidationErrors) =>
    Object.entries(componentsValidationErrors).reduce<Record<EntityId, { ownerComponentId: EntityId; error: ComponentValidationError }>>(
        (result, [componentId, errors]) => {
            errors.forEach((error) => {
                result[error.id] = { ownerComponentId: componentId, error }
            })
            return result
        },
        {},
    )
