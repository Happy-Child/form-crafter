import { ComponentModule, GroupOptionsBuilder, isComponentModuleWithRelations, isRelationsRuleWithGroupOptions } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'

import { extractPathsOptionsBuilderStructDeps } from './extract-paths-options-builder-struct-deps'

export const getDepsPathsRulesComponents = (theme: ComponentModule[]): Record<string, string[][]> => {
    const rulesOptionsBuilders = theme.reduce<Record<string, GroupOptionsBuilder<OptionalSerializableObject>>>((map, componentModule) => {
        if (isComponentModuleWithRelations(componentModule) && isNotEmpty(componentModule.relationsRules)) {
            const finalRules = componentModule.relationsRules.filter(isRelationsRuleWithGroupOptions)
            const optionsBuilders = finalRules.reduce<Record<string, GroupOptionsBuilder<OptionalSerializableObject>>>(
                (map, { ruleName, optionsBuilder }) => ({ ...map, [ruleName]: optionsBuilder }),
                {},
            )
            return {
                ...map,
                ...optionsBuilders,
            }
        }
        return map
    }, {})

    const pathsMap = Object.entries(rulesOptionsBuilders).reduce<Record<string, string[][]>>((map, [ruleName, optionsBuilder]) => {
        const paths = extractPathsOptionsBuilderStructDeps(optionsBuilder.struct)
        if (isNotEmpty(paths)) {
            return { ...map, [ruleName]: paths }
        }
        return map
    }, {})

    return pathsMap
}
