import { GroupOptionsBuilder, isRelationsRuleWithGroupOptions, RelationRule } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'

import { extractPathsOptionsBuilderStructDeps } from './extract-paths-options-builder-struct-deps'

export const getDepsPathsRulesComponents = (rulationsRules: RelationRule<OptionalSerializableObject>[]): Record<string, string[][]> => {
    const rulesOptionsBuilders = rulationsRules.reduce<Record<string, GroupOptionsBuilder<OptionalSerializableObject>>>((map, relationRule) => {
        if (isRelationsRuleWithGroupOptions(relationRule)) {
            const { ruleName, optionsBuilder } = relationRule
            return {
                ...map,
                [ruleName]: optionsBuilder,
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
