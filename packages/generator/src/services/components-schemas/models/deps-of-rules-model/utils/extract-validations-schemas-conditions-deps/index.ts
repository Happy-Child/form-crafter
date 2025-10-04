import { ValidationRuleSchema } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraphAsSet } from '../../../../../../types'
import { extractComponentConditionDeps } from '../extract-component-condition-deps'

export const extractValidationsSchemasConditionsDeps = (validationSchemas: Pick<ValidationRuleSchema, 'id' | 'condition'>[] | undefined) => {
    const schemaIdToDeps: DepsGraphAsSet = {}

    if (!isNotEmpty(validationSchemas)) {
        return schemaIdToDeps
    }

    validationSchemas.forEach((schema) => {
        if (!isNotEmpty(schema.condition)) {
            return
        }
        const componentsDeps = extractComponentConditionDeps(schema.condition)
        schemaIdToDeps[schema.id] = new Set(componentsDeps)
    })

    return schemaIdToDeps
}
