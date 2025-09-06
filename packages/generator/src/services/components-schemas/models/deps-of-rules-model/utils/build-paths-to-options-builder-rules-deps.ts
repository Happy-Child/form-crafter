import { GroupOptionsBuilder, isMutationRuleWithOptionsBuilder } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../theme'
import { extractPathsOptionsBuilderDeps } from './extract-paths-options-builder-deps'

export const buildPathsToOptionsBuilderRulesDeps = (rules: UnitValue<ThemeService['$mutationsRules']>): Record<string, string[][]> => {
    const rulesOptionsBuilders = Object.entries(rules).reduce<Record<string, GroupOptionsBuilder>>((map, [key, mutationRule]) => {
        if (isMutationRuleWithOptionsBuilder(mutationRule)) {
            const { optionsBuilder } = mutationRule
            return {
                ...map,
                [key]: optionsBuilder,
            }
        }

        return map
    }, {})

    const pathsMap = Object.entries(rulesOptionsBuilders).reduce<Record<string, string[][]>>((map, [key, optionsBuilder]) => {
        const paths = extractPathsOptionsBuilderDeps(optionsBuilder.struct)
        if (isNotEmpty(paths)) {
            return { ...map, [key]: paths }
        }
        return map
    }, {})

    return pathsMap
}
