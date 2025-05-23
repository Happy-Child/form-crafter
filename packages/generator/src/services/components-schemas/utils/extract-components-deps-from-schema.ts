import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { extractComponentsDepsFromConditions } from './extract-components-deps-from-conditions'
import { getRuleOptionsValuesByDepsPaths } from './get-rule-options-values-by-deps-paths'

const getReverseDepsGraph = (depsGraph: Record<EntityId, EntityId[]>) =>
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

    entriesMap.forEach(([componentId, { relations }]) => {
        const userOptions = relations?.options

        if (!isNotEmpty(userOptions)) {
            return
        }

        const userOptionsComponentsDeps: EntityId[] = []
        userOptions.forEach((userOption) => {
            if (isNotEmpty(userOption.condition)) {
                const deps = extractComponentsDepsFromConditions([], userOption.condition)
                userOptionsComponentsDeps.push(...deps)
            }

            const optionsDepsKeys = depsPathsRulesComponents[userOption.ruleName]

            if (isNotEmpty(userOption.options) && isNotEmpty(optionsDepsKeys)) {
                const depsKeys = getRuleOptionsValuesByDepsPaths(userOption.options, optionsDepsKeys)

                userOptionsComponentsDeps.push(...depsKeys)
            }
        })

        depsGraph[componentId] = Array.from(new Set(userOptionsComponentsDeps))
    })

    const reverseDepsGraph = getReverseDepsGraph(depsGraph)

    return { depsGraph, reverseDepsGraph }
}
