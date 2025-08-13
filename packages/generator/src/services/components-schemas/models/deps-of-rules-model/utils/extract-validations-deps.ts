import { EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { extractDepsFromConditions } from './extract-deps-from-conditions'

export const extractValidationsDeps = (validationSchemas: Pick<ValidationRuleSchema, 'id' | 'condition'>[] | undefined) => {
    const validationSchemasIdToDeps: Record<string, EntityId[]> = {}

    if (!isNotEmpty(validationSchemas)) {
        return validationSchemasIdToDeps
    }

    validationSchemas.forEach((schema) => {
        if (isEmpty(schema.condition)) {
            return
        }
        const deps = extractDepsFromConditions([], schema.condition)
        validationSchemasIdToDeps[schema.id] = deps
    })

    return validationSchemasIdToDeps
}
