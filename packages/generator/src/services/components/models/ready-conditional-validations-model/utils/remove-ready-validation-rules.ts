import { EntityId, ReadyValidations } from '@form-crafter/core'
import { differenceSet, isEmpty } from '@form-crafter/utils'

export const removeReadyValidationRules = (readyRules: ReadyValidations, rulesIdsToRemove: Set<EntityId>) => {
    const result = Object.entries(readyRules).reduce<ReadyValidations>((finalRedyRules, [key, readyRules]) => {
        const updatedReadyRules = differenceSet(readyRules, rulesIdsToRemove)
        if (isEmpty(updatedReadyRules)) {
            delete finalRedyRules[key]
        } else {
            finalRedyRules[key] = updatedReadyRules
        }
        return finalRedyRules
    }, {})
    return { ...result }
}
