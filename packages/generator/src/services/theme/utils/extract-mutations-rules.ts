import { ComponentModule, isComponentModuleWithMutations, MutationRule } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'

export const extractMutationsRules = (componentsModules: ComponentModule[]): Record<string, MutationRule<OptionalSerializableObject>> => {
    const rules = componentsModules.reduce<MutationRule<OptionalSerializableObject>[]>((result, componentModule) => {
        if (isComponentModuleWithMutations(componentModule) && isNotEmpty(componentModule.mutationsRules)) {
            return [...result, ...(componentModule.mutationsRules as MutationRule<OptionalSerializableObject>[])]
        }
        return result
    }, [])

    const rulesMap = rules.reduce((map, rule) => {
        if (rule.ruleName in map) {
            return map
        }
        return { ...map, [rule.ruleName]: rule }
    }, {})

    return rulesMap
}
