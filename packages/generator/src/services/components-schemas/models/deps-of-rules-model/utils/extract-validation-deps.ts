import { EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { extractDepsFromConditions } from './extract-deps-from-conditions'

export const extractValidationDeps = (validationSchemas: Pick<ValidationRuleSchema, 'id' | 'condition'>[] | undefined) => {
    const schemaIdToDeps: Record<string, EntityId[]> = {}

    if (!isNotEmpty(validationSchemas)) {
        return schemaIdToDeps
    }

    validationSchemas.forEach((schema) => {
        if (isEmpty(schema.condition)) {
            return
        }
        const deps = extractDepsFromConditions([], schema.condition)
        schemaIdToDeps[schema.id] = deps
    })

    return schemaIdToDeps
}
