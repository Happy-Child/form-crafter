import { ComponentsValidationErrors, EntityId } from '@form-crafter/core'

export const removeValidationErrors = (curErrors: ComponentsValidationErrors, componentsIds: Set<EntityId>) => {
    const result = { ...curErrors }
    for (const componentId of componentsIds) {
        if (componentId in result) {
            delete result[componentId]
            return result
        }
    }
    return result
}
