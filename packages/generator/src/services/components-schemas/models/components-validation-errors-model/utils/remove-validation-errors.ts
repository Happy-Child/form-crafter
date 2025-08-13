import { EntityId } from '@form-crafter/core'

import { ComponentsValidationErrors } from '../types'

export const removeValidationErrors = (curErrors: ComponentsValidationErrors, componentId: EntityId) => {
    const result = { ...curErrors }
    if (componentId in result) {
        delete result[componentId]
        return result
    }
    return curErrors
}
