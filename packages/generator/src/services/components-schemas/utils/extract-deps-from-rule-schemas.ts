import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { buildReverseDepsGraph } from './build-reverse-deps-graph'
import { extractDepsFromConditions } from './extract-deps-from-conditions'
import { extractValidationsDeps } from './extract-validations-deps'
import { getRuleOptionsValuesByDepsPaths } from './get-rule-options-values-by-deps-paths'

export const extractDepsFromRuleSchemas = (componentsSchemas: ComponentsSchemas, depsPathsOptiondsBuilderRelationsRules: Record<EntityId, EntityId[][]>) => {
    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)

    const relationSchemasIdToDeps: Record<EntityId, EntityId[]> = {}
    let validationSchemasIdToDeps: Record<string, EntityId[]> = {}

    entriesMap.forEach(([componentId, { relations, validations, visability }]) => {
        const relationsRulesDeps: EntityId[] = []

        if (isNotEmpty(visability) && isNotEmpty(visability.condition)) {
            const deps = extractDepsFromConditions([], visability.condition)
            relationsRulesDeps.push(...deps)
        }

        const relationsSchemas = relations?.schemas
        if (isNotEmpty(relationsSchemas)) {
            relationsSchemas.forEach((schema) => {
                if (isNotEmpty(schema.condition)) {
                    const deps = extractDepsFromConditions([], schema.condition)
                    relationsRulesDeps.push(...deps)
                }

                const optionsDepsKeys = depsPathsOptiondsBuilderRelationsRules[schema.ruleName]
                if (isNotEmpty(schema.options) && isNotEmpty(optionsDepsKeys)) {
                    const deps = getRuleOptionsValuesByDepsPaths(schema.options, optionsDepsKeys)
                    relationsRulesDeps.push(...deps)
                }
            })
        }

        if (isNotEmpty(relationsRulesDeps)) {
            relationSchemasIdToDeps[componentId] = Array.from(new Set(relationsRulesDeps))
        }

        validationSchemasIdToDeps = {
            ...validationSchemasIdToDeps,
            ...extractValidationsDeps(validations?.schemas),
        }
    })

    return {
        // schemaIdToDeps - ключ зависит от элементой массива значения
        // schemaIdToDependents - от ключа зависят элемента массива значений
        relations: { schemaIdToDeps: relationSchemasIdToDeps, schemaIdToDependents: buildReverseDepsGraph(relationSchemasIdToDeps) },
        validations: { schemaIdToDeps: validationSchemasIdToDeps, schemaIdToDependents: buildReverseDepsGraph(validationSchemasIdToDeps) },
    }
}
