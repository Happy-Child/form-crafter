import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { extractComponentsDepsFromConditions } from './extract-components-deps-from-conditions'
import { getRuleOptionsValuesByDepsPaths } from './get-rule-options-values-by-deps-paths'

const buildReverseDepsGraph = (depsGraph: Record<EntityId, EntityId[]>) =>
    Object.entries(depsGraph).reduce<Record<EntityId, EntityId[]>>((graph, [componentId, deps]) => {
        deps.forEach((depId) => {
            if (!graph[depId]) {
                graph[depId] = []
            }
            graph[depId].push(componentId)
        })

        return graph
    }, {})

export const extractComponentsDepsFromSchema = (componentsSchemas: ComponentsSchemas, depsPathsRulesComponents: Record<EntityId, EntityId[][]>) => {
    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)
    const depsGraph: Record<EntityId, EntityId[]> = {}

    entriesMap.forEach(([componentId]) => (depsGraph[componentId] = []))

    entriesMap.forEach(([componentId, { relations, visability }]) => {
        const сomponentsDeps: EntityId[] = []

        if (isNotEmpty(visability) && isNotEmpty(visability.condition)) {
            const deps = extractComponentsDepsFromConditions([], visability.condition)
            сomponentsDeps.push(...deps)
        }

        const userOptions = relations?.options
        if (isNotEmpty(userOptions)) {
            userOptions.forEach((userOption) => {
                if (isNotEmpty(userOption.condition)) {
                    const deps = extractComponentsDepsFromConditions([], userOption.condition)
                    сomponentsDeps.push(...deps)
                }

                const optionsDepsKeys = depsPathsRulesComponents[userOption.ruleName]

                if (isNotEmpty(userOption.options) && isNotEmpty(optionsDepsKeys)) {
                    const deps = getRuleOptionsValuesByDepsPaths(userOption.options, optionsDepsKeys)
                    сomponentsDeps.push(...deps)
                }
            })
        }

        if (isEmpty(сomponentsDeps)) {
            return
        }

        depsGraph[componentId] = Array.from(new Set(сomponentsDeps))
    })

    const reverseDepsGraph = buildReverseDepsGraph(depsGraph)

    return { depsGraph, reverseDepsGraph }
}
