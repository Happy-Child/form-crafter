import { ComponentModule, isComponentModuleWithMutations, MutationRule } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

export const extractMutations = (componentsModules: ComponentModule[]): Record<string, MutationRule> => {
    const rules = componentsModules.reduce<MutationRule[]>((result, componentModule) => {
        if (isComponentModuleWithMutations(componentModule) && isNotEmpty(componentModule.mutations)) {
            return [...result, ...componentModule.mutations]
        }
        return result
    }, [])

    const rulesMap = rules.reduce((map, rule) => {
        if (rule.key in map) {
            return map
        }
        return { ...map, [rule.key]: rule }
    }, {})

    return rulesMap
}
