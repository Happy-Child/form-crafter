import { EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { ReadyValidationsRules } from '../types'

export const getPermanentValidationsSchemas = (validationsSchemas: ValidationRuleSchema[]): ReadyValidationsRules[keyof ReadyValidationsRules] => {
    const readyBySchemaId = new Set<EntityId>()
    const readyGroupedByRuleName: Record<string, Set<EntityId>> = {}

    if (isNotEmpty(validationsSchemas)) {
        for (const validation of validationsSchemas) {
            if (isEmpty(validation.condition)) {
                readyBySchemaId.add(validation.id)

                if (!readyGroupedByRuleName[validation.ruleName]) {
                    readyGroupedByRuleName[validation.ruleName] = new Set()
                }
                readyGroupedByRuleName[validation.ruleName].add(validation.id)
            }
        }
    }

    return { readyBySchemaId, readyGroupedByRuleName }
}
