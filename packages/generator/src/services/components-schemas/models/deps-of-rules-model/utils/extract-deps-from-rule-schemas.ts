import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { buildReverseDepsGraph } from './build-reverse-deps-graph'
import { extractDepsFromConditions } from './extract-deps-from-conditions'
import { extractValidationsDeps } from './extract-validations-deps'
import { getRuleOptionsValuesByDepsPaths } from './get-rule-options-values-by-deps-paths'

export const extractDepsFromRuleSchemas = (componentsSchemas: ComponentsSchemas, depsPathsOptiondsBuildermutationsRules: Record<EntityId, EntityId[][]>) => {
    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)

    const mutationSchemasIdToDeps: Record<EntityId, EntityId[]> = {}
    let validationSchemasIdToDeps: Record<string, EntityId[]> = {}

    entriesMap.forEach(([componentId, { mutations, validations, visability }]) => {
        const mutationsRulesDeps: EntityId[] = []

        if (isNotEmpty(visability) && isNotEmpty(visability.condition)) {
            const deps = extractDepsFromConditions([], visability.condition)
            mutationsRulesDeps.push(...deps)
        }

        const mutationsSchemas = mutations?.schemas
        if (isNotEmpty(mutationsSchemas)) {
            mutationsSchemas.forEach((schema) => {
                if (isNotEmpty(schema.condition)) {
                    const deps = extractDepsFromConditions([], schema.condition)
                    mutationsRulesDeps.push(...deps)
                }

                const optionsDepsKeys = depsPathsOptiondsBuildermutationsRules[schema.ruleName]
                if (isNotEmpty(schema.options) && isNotEmpty(optionsDepsKeys)) {
                    const deps = getRuleOptionsValuesByDepsPaths(schema.options, optionsDepsKeys)
                    mutationsRulesDeps.push(...deps)
                }
            })
        }

        if (isNotEmpty(mutationsRulesDeps)) {
            mutationSchemasIdToDeps[componentId] = Array.from(new Set(mutationsRulesDeps))
        }

        validationSchemasIdToDeps = {
            ...validationSchemasIdToDeps,
            ...extractValidationsDeps(validations?.schemas),
        }
    })

    return {
        // schemaIdToDeps - ключ зависит от элементой массива значения
        // schemaIdToDependents - от ключа зависят элемента массива значений
        mutations: { schemaIdToDeps: mutationSchemasIdToDeps, schemaIdToDependents: buildReverseDepsGraph(mutationSchemasIdToDeps) },
        validations: { schemaIdToDeps: validationSchemasIdToDeps, schemaIdToDependents: buildReverseDepsGraph(validationSchemasIdToDeps) },
    }
}
