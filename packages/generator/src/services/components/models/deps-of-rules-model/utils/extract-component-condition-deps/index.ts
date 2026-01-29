import { ConditionNode, EntityId } from '@form-crafter/core'

export const extractComponentConditionDeps = (condition: ConditionNode, deps: Set<EntityId> = new Set()) => {
    if (condition.type === 'component') {
        deps.add(condition.meta.id)
        return deps
    }

    const childDeps = condition.operands.reduce((result, operand) => {
        const extracted = extractComponentConditionDeps(operand)
        return new Set([...result, ...extracted])
    }, new Set<EntityId>())

    deps = new Set([...deps, ...childDeps])

    return deps
}
