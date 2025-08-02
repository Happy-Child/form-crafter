import { EntityId } from '@form-crafter/core'
import { differenceSet, isEmpty } from '@form-crafter/utils'

import { ReadyValidationsRules } from '../types'

export const removeReadyValidationRules = (readyRules: ReadyValidationsRules, rulesIdsToRemove: Set<EntityId>) => {
    const result = Object.entries(readyRules).reduce<ReadyValidationsRules>((finalRedyRules, [key, readyRules]) => {
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
