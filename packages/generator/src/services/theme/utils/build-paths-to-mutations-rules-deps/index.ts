import {
    GroupOptionsBuilder,
    isComponentOptionsBuilder,
    isGroupOptionsBuilder,
    isMultifieldOptionsBuilder,
    isMutationRuleWithOptionsBuilder,
    MutationRule,
    OptionsBuilder,
} from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

const extractDepsPaths = (builder: OptionsBuilder, path: string[] = []): string[][] => {
    const result: string[][] = []

    if (isGroupOptionsBuilder(builder)) {
        const structEntries = Object.entries(builder.struct)

        structEntries.forEach(([key, builder]) => {
            if (isGroupOptionsBuilder(builder) || isMultifieldOptionsBuilder(builder)) {
                const childPaths = extractDepsPaths(builder, [...path, key])
                result.push(...childPaths)
            } else if (isComponentOptionsBuilder(builder)) {
                result.push([...path, key])
            }
        })
    } else if (isMultifieldOptionsBuilder(builder)) {
        const templateBuilder = builder.properties.template

        if (isGroupOptionsBuilder(templateBuilder) || isMultifieldOptionsBuilder(templateBuilder)) {
            const childPaths = extractDepsPaths(templateBuilder, path)
            result.push(...childPaths)
        } else if (isComponentOptionsBuilder(templateBuilder)) {
            result.push(path)
        }
    } else if (isComponentOptionsBuilder(builder)) {
        result.push(path)
    }

    return result
}

export const buildPathsToMutationsRulesDeps = (rulesMap: Record<string, MutationRule>): Record<string, string[][]> => {
    const rulesOptionsBuilders = Object.entries(rulesMap).reduce<Record<string, GroupOptionsBuilder>>((map, [key, mutationRule]) => {
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
        const paths = extractDepsPaths(optionsBuilder)

        if (isNotEmpty(paths)) {
            return { ...map, [key]: paths }
        }

        return map
    }, {})

    return pathsMap
}
