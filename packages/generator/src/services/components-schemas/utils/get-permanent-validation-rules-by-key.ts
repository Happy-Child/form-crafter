import { EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { ReadyValidationsRulesByKey } from '../models/ready-conditional-validation-rules-model'

export const getPermanentValidationRulesByKey = (validationsSchemas: ValidationRuleSchema[]): ReadyValidationsRulesByKey[keyof ReadyValidationsRulesByKey] => {
    const groupedByKey: Record<string, Set<EntityId>> = {}

    if (isNotEmpty(validationsSchemas)) {
        for (const validation of validationsSchemas) {
            if (isNotEmpty(validation.condition)) {
                continue
            }

            if (!groupedByKey[validation.key]) {
                groupedByKey[validation.key] = new Set()
            }

            groupedByKey[validation.key].add(validation.id)
        }
    }

    return groupedByKey
}
