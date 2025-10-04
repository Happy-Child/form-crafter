import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { UnitValue } from 'effector'

import { DepsGraphAsSet } from '../../../../../../types'
import { ThemeService } from '../../../../../theme'
import { DepsByMutationsRules } from '../../types'
import { buildReverseDepsGraph } from '../build-reverse-deps-graph'
import { extractComponentConditionDeps } from '../extract-component-condition-deps'
import { extractValuesByDepsPaths } from '../extract-values-by-deps-paths'

export const extractComponentsMutationsDeps = (
    componentsSchemas: ComponentsSchemas,
    pathsToDeps: UnitValue<ThemeService['$pathsToMutationsRulesDeps']>,
): DepsByMutationsRules => {
    const entriesMap: [EntityId, ComponentSchema][] = Object.entries(componentsSchemas)

    const componentIdToDeps: DepsGraphAsSet = {}

    entriesMap.forEach(([componentId, { mutations }]) => {
        let componentsDeps = new Set<EntityId>()
        const mutationsSchemas = mutations?.schemas

        if (isNotEmpty(mutationsSchemas)) {
            mutationsSchemas.forEach((schema) => {
                if (isNotEmpty(schema.condition)) {
                    const deps = extractComponentConditionDeps(schema.condition)
                    componentsDeps = new Set([...componentsDeps, ...deps])
                }

                const depsPath = pathsToDeps[schema.key]
                if (isNotEmpty(schema.options) && isNotEmpty(depsPath)) {
                    const deps = extractValuesByDepsPaths(schema.options, depsPath)
                    componentsDeps = new Set([...componentsDeps, ...deps])
                }
            })
        }

        if (isNotEmpty(componentsDeps)) {
            componentIdToDeps[componentId] = componentsDeps
        }
    })

    return {
        componentIdToDeps,
        componentIdToDependents: buildReverseDepsGraph(componentIdToDeps),
    }
}
