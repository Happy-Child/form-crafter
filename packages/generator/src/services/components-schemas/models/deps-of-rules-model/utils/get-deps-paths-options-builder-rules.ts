import { GroupOptionsBuilder, isMutationRuleWithGroupOptions, MutationRule } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'

import { extractPathsOptionsBuilderStructDeps } from './extract-paths-options-builder-struct-deps'

export const getDepsPathsOptionsBuilderRules = (rules: Record<string, MutationRule<OptionalSerializableObject>>): Record<string, string[][]> => {
    const rulesOptionsBuilders = Object.entries(rules).reduce<Record<string, GroupOptionsBuilder<OptionalSerializableObject>>>(
        (map, [ruleName, mutationRule]) => {
            if (isMutationRuleWithGroupOptions(mutationRule)) {
                const { optionsBuilder } = mutationRule
                return {
                    ...map,
                    [ruleName]: optionsBuilder,
                }
            }

            return map
        },
        {},
    )

    const pathsMap = Object.entries(rulesOptionsBuilders).reduce<Record<string, string[][]>>((map, [ruleName, optionsBuilder]) => {
        const paths = extractPathsOptionsBuilderStructDeps(optionsBuilder.struct)
        if (isNotEmpty(paths)) {
            return { ...map, [ruleName]: paths }
        }
        return map
    }, {})

    return pathsMap
}
