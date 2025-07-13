import { ComponentModule, isComponentModuleWithRelations, RelationRule } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'

export const extractRelationsRules = (componentsModules: ComponentModule[]): Record<string, RelationRule<OptionalSerializableObject>> => {
    const rules = componentsModules.reduce<RelationRule<OptionalSerializableObject>[]>((result, componentModule) => {
        if (isComponentModuleWithRelations(componentModule) && isNotEmpty(componentModule.relationsRules)) {
            return [...result, ...(componentModule.relationsRules as RelationRule<OptionalSerializableObject>[])]
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
