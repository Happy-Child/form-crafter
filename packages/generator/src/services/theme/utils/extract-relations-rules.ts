import { ComponentModule, isComponentModuleWithRelations, RelationRule } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'

export const extractRelationsRules = (theme: ComponentModule[]): RelationRule<OptionalSerializableObject>[] =>
    theme.reduce<RelationRule<OptionalSerializableObject>[]>((result, componentModule) => {
        if (isComponentModuleWithRelations(componentModule) && isNotEmpty(componentModule.relationsRules)) {
            return [...result, ...(componentModule.relationsRules as RelationRule<OptionalSerializableObject>[])]
        }
        return result
    }, [])
