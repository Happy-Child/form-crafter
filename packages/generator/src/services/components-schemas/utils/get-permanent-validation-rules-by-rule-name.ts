import { EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { ReadyValidationsRulesByRuleName } from '../models/ready-conditional-validation-rules-model'

export const getPermanentValidationRulesByRuleName = (
    validationsSchemas: ValidationRuleSchema[],
): ReadyValidationsRulesByRuleName[keyof ReadyValidationsRulesByRuleName] => {
    const groupedByRuleName: Record<string, Set<EntityId>> = {}

    if (isNotEmpty(validationsSchemas)) {
        for (const validation of validationsSchemas) {
            if (isNotEmpty(validation.condition)) {
                continue
            }

            if (!groupedByRuleName[validation.ruleName]) {
                groupedByRuleName[validation.ruleName] = new Set()
            }

            groupedByRuleName[validation.ruleName].add(validation.id)
        }
    }

    return groupedByRuleName
}
