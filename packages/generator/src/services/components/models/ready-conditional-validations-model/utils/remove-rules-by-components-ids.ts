import { EntityId } from '@form-crafter/core'

export const removeRulesByComponentsIds = <T extends Record<EntityId, unknown>>(rules: T, componentsIds: Set<EntityId>) => {
    const result = { ...rules }
    for (const componentId of componentsIds) {
        if (componentId in rules) {
            delete result[componentId]
        }
    }
    return rules
}
