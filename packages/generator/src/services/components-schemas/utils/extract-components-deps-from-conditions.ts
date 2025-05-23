import { ConditionNode, EntityId } from '@form-crafter/core'

export const extractComponentsDepsFromConditions = (deps: EntityId[], condition: ConditionNode) => {
    if (condition.type === 'component') {
        deps.push(condition.componentId)
        return deps
    }

    const childDeps = condition.operands.flatMap((operand) => extractComponentsDepsFromConditions([], operand))
    deps.push(...childDeps)

    return deps
}
