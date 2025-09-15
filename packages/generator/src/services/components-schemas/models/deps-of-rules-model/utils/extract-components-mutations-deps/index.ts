import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../../theme'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractConditionDeps } from '../extract-condition-deps'
import { extractValuesByDepsPaths } from '../extract-values-by-deps-paths'

export const extractComponentsMutationsDeps = (componentsSchemas: ComponentsSchemas, pathsToDeps: UnitValue<ThemeService['$pathsToMutationsRulesDeps']>) => {
    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)

    const componentIdToDeps: Record<EntityId, EntityId[]> = {}

    entriesMap.forEach(([componentId, { mutations }]) => {
        const componentsIdsDeps: EntityId[] = []
        const mutationsSchemas = mutations?.schemas

        if (isNotEmpty(mutationsSchemas)) {
            mutationsSchemas.forEach((schema) => {
                if (isNotEmpty(schema.condition)) {
                    const deps = extractConditionDeps([], schema.condition)
                    componentsIdsDeps.push(...deps)
                }

                const depsPath = pathsToDeps[schema.key]
                if (isNotEmpty(schema.options) && isNotEmpty(depsPath)) {
                    const deps = extractValuesByDepsPaths(schema.options, depsPath)
                    componentsIdsDeps.push(...deps)
                }
            })
        }

        if (isNotEmpty(componentsIdsDeps)) {
            componentIdToDeps[componentId] = Array.from(new Set(componentsIdsDeps))
        }
    })

    return {
        componentIdToDeps,
        componentIdToDependents: buildReverseDepsGraph(componentIdToDeps),
    }
}
