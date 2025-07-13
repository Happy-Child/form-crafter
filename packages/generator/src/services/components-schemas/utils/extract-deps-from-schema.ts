import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { extractDepsFromConditions } from './extract-deps-from-conditions'
import { getRuleOptionsValuesByDepsPaths } from './get-rule-options-values-by-deps-paths'

const buildReverseDepsGraph = (depsGraph: Record<EntityId, EntityId[]>) =>
    Object.entries(depsGraph).reduce<Record<EntityId, EntityId[]>>((graph, [entityId, deps]) => {
        deps.forEach((depId) => {
            if (!graph[depId]) {
                graph[depId] = []
            }
            graph[depId].push(entityId)
        })

        return graph
    }, {})

export const extractDepsFromSchema = (componentsSchemas: ComponentsSchemas, depsPathsOptiondsBuilderRelationsRules: Record<EntityId, EntityId[][]>) => {
    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)

    const relationsSchemaIdToDeps: Record<EntityId, EntityId[]> = {}
    const validationsSchemaIdToDeps: Record<string, EntityId[]> = {}

    entriesMap.forEach(([componentId, { relations, validations, visability }]) => {
        const relationsRulesDeps: EntityId[] = []

        if (isNotEmpty(visability) && isNotEmpty(visability.condition)) {
            const deps = extractDepsFromConditions([], visability.condition)
            relationsRulesDeps.push(...deps)
        }

        const relationsRulesUserOptions = relations?.options
        if (isNotEmpty(relationsRulesUserOptions)) {
            relationsRulesUserOptions.forEach((userOption) => {
                if (isNotEmpty(userOption.condition)) {
                    const deps = extractDepsFromConditions([], userOption.condition)
                    relationsRulesDeps.push(...deps)
                }

                const optionsDepsKeys = depsPathsOptiondsBuilderRelationsRules[userOption.ruleName]
                if (isNotEmpty(userOption.options) && isNotEmpty(optionsDepsKeys)) {
                    const deps = getRuleOptionsValuesByDepsPaths(userOption.options, optionsDepsKeys)
                    relationsRulesDeps.push(...deps)
                }
            })
        }

        if (isNotEmpty(relationsRulesDeps)) {
            relationsSchemaIdToDeps[componentId] = Array.from(new Set(relationsRulesDeps))
        }

        const validationsRulesUserOptions = validations?.options
        if (isNotEmpty(validationsRulesUserOptions)) {
            validationsRulesUserOptions.forEach((userOption) => {
                if (isEmpty(userOption.condition)) {
                    return
                }

                const deps = extractDepsFromConditions([], userOption.condition)
                validationsSchemaIdToDeps[userOption.id] = deps
            })
        }
    })

    return {
        // schemaIdToDeps - ключ зависит от элементой массива значения
        // schemaIdToDependents - от ключа зависят элемента массива значений
        relations: { schemaIdToDeps: relationsSchemaIdToDeps, schemaIdToDependents: buildReverseDepsGraph(relationsSchemaIdToDeps) },
        validations: { schemaIdToDeps: validationsSchemaIdToDeps, schemaIdToDependents: buildReverseDepsGraph(validationsSchemaIdToDeps) },
    }
}
