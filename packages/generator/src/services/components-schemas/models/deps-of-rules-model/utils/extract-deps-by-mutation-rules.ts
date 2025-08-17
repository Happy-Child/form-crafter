import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../theme'
import { buildPathsToOptionsBuilderRulesDeps } from './build-paths-to-options-builder-rules-deps'
import { buildReverseDepsGraph } from './build-reverse-deps-graph'
import { extractDepsFromConditions } from './extract-deps-from-conditions'
import { getRuleOptionsValuesByDepsPaths } from './get-rule-options-values-by-deps-paths'

export const extractComponentsDepsByMutationRules = (componentsSchemas: ComponentsSchemas, rules: UnitValue<ThemeService['$mutationsRules']>) => {
    const pathsToOptionsBuilderRulesDeps = buildPathsToOptionsBuilderRulesDeps(rules)

    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)

    const componentIdToDeps: Record<EntityId, EntityId[]> = {}

    entriesMap.forEach(([componentId, { mutations }]) => {
        const componentsIdsDeps: EntityId[] = []

        const mutationsSchemas = mutations?.schemas
        if (isNotEmpty(mutationsSchemas)) {
            mutationsSchemas.forEach((schema) => {
                if (isNotEmpty(schema.condition)) {
                    const deps = extractDepsFromConditions([], schema.condition)
                    componentsIdsDeps.push(...deps)
                }

                const optionsDepsKeys = pathsToOptionsBuilderRulesDeps[schema.ruleName]
                if (isNotEmpty(schema.options) && isNotEmpty(optionsDepsKeys)) {
                    const deps = getRuleOptionsValuesByDepsPaths(schema.options, optionsDepsKeys)
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
