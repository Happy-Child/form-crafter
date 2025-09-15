import { EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { extractConditionDeps } from '../extract-condition-deps'

export const extractValidationsSchemasConditionsDeps = (validationSchemas: Pick<ValidationRuleSchema, 'id' | 'condition'>[] | undefined) => {
    const schemaIdToDeps: Record<string, EntityId[]> = {}

    if (!isNotEmpty(validationSchemas)) {
        return schemaIdToDeps
    }

    validationSchemas.forEach((schema) => {
        if (!isNotEmpty(schema.condition)) {
            return
        }
        const deps = extractConditionDeps([], schema.condition)
        schemaIdToDeps[schema.id] = deps
    })

    return schemaIdToDeps
}
