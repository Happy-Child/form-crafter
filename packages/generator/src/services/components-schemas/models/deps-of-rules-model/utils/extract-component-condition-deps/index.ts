import { EntityId, MutationConditionNode, ValidationConditionNode } from '@form-crafter/core'

export const extractComponentConditionDeps = (condition: MutationConditionNode | ValidationConditionNode, deps: Set<EntityId> = new Set()) => {
    if (condition.type === 'view') {
        return new Set<EntityId>()
    }

    if (condition.type === 'component') {
        deps.add(condition.componentId)
        return deps
    }

    const childDeps = condition.operands.reduce((result, operand) => {
        const extracted = extractComponentConditionDeps(operand)
        return new Set([...result, ...extracted])
    }, new Set<EntityId>())

    deps = new Set([...deps, ...childDeps])

    return deps
}
