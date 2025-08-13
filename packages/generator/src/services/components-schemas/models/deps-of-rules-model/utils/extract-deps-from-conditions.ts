import { ConditionNode, EntityId } from '@form-crafter/core'

export const extractDepsFromConditions = (deps: EntityId[], condition: ConditionNode) => {
    if (condition.type === 'component') {
        deps.push(condition.componentId)
        return deps
    }

    const childDeps = condition.operands.flatMap((operand) => extractDepsFromConditions([], operand))
    deps.push(...childDeps)

    return deps
}
