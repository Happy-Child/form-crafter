import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { ComponentsValidationErrors } from '../types'

type FilteredErrorsPayload = {
    filteredErrors: ComponentsValidationErrors
    wasChanged: boolean
}

export const filterValidationErrors = (curErrors: ComponentsValidationErrors, validationIdsToRemove: Set<EntityId>) => {
    const { filteredErrors, wasChanged } = Object.entries(curErrors).reduce<FilteredErrorsPayload>(
        (result, [componentId, curErrors]) => {
            const newErrors = new Map(curErrors)

            for (const idToRemove of validationIdsToRemove) {
                newErrors.delete(idToRemove)
            }

            const wasChanged = newErrors.size !== curErrors.size
            if (wasChanged) {
                result.wasChanged = true
            }

            if (isNotEmpty(newErrors)) {
                result.filteredErrors[componentId] = wasChanged ? curErrors : newErrors
            }

            return result
        },
        { filteredErrors: {}, wasChanged: false },
    )

    return wasChanged ? filteredErrors : curErrors
}
