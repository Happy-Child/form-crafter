import { GroupOptionsBuilder, isMutationRuleWithGroupOptions } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../theme'
import { extractPathsOptionsBuilderDeps } from './extract-paths-options-builder-deps'

export const buildPathsToOptionsBuilderRulesDeps = (rules: UnitValue<ThemeService['$mutationsRules']>): Record<string, string[][]> => {
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
        const paths = extractPathsOptionsBuilderDeps(optionsBuilder.struct)
        if (isNotEmpty(paths)) {
            return { ...map, [ruleName]: paths }
        }
        return map
    }, {})

    return pathsMap
}
