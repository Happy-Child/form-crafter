import { ComponentsValidationErrors, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

type FilteredErrorsPayload = {
    filteredErrors: ComponentsValidationErrors
    wasChanged: boolean
}

export const filterValidationErrors = (curErrors: ComponentsValidationErrors, validationIdsToRemove: Set<EntityId>) => {
    const { filteredErrors, wasChanged } = Object.entries(curErrors).reduce<FilteredErrorsPayload>(
        (result, [componentId, componentErrors]) => {
            const finalErrors = new Map(componentErrors)

            for (const idToRemove of validationIdsToRemove) {
                finalErrors.delete(idToRemove)
            }

            const wasChanged = finalErrors.size !== componentErrors.size
            if (wasChanged) {
                result.wasChanged = true
            }

            if (isNotEmpty(finalErrors)) {
                result.filteredErrors[componentId] = wasChanged ? finalErrors : componentErrors
            }

            return result
        },
        { filteredErrors: {}, wasChanged: false },
    )

    return wasChanged ? filteredErrors : curErrors
}
