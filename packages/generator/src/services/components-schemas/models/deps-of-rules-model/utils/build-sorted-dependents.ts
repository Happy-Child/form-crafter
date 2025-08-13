import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { topologicalSortDeps } from './topological-sort-deps'

const extractAffectedDependents = (componentId: EntityId, entityIdToDependents: Record<EntityId, EntityId[]>): EntityId[] => {
    const directDependents = entityIdToDependents[componentId]
    if (!directDependents?.length) {
        return []
    }

    const result: Set<EntityId> = new Set()

    const queue: EntityId[] = [...directDependents]

    while (queue.length) {
        const componentId = queue.shift()!

        if (result.has(componentId)) {
            continue
        }

        result.add(componentId)

        const dependents = entityIdToDependents[componentId]
        if (!isNotEmpty(dependents)) {
            continue
        }

        queue.push(...dependents)
    }

    return Array.from(result)
}

export const buildSortedDependents = (
    entityIdToDeps: Record<EntityId, EntityId[]>,
    entityIdToDependents: Record<EntityId, EntityId[]>,
): Record<EntityId, EntityId[]> => {
    const data: Record<EntityId, EntityId[]> = {}

    for (const [componentId] of Object.entries(entityIdToDependents)) {
        const affected = extractAffectedDependents(componentId, entityIdToDependents)
        const sortedDependents = topologicalSortDeps(affected, entityIdToDeps)
        data[componentId] = sortedDependents
    }

    return data
}
