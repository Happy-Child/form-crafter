import { ComponentsValidationErrors, EntityId } from '@form-crafter/core'

export const removeValidationErrors = (curErrors: ComponentsValidationErrors, componentId: EntityId) => {
    const result = { ...curErrors }
    if (componentId in result) {
        delete result[componentId]
        return result
    }
    return curErrors
}
