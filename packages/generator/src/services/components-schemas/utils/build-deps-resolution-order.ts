import { EntityId, errorCodes, FormCrafterError, getErrorMessages } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

const extractAffectedDeps = (componentId: EntityId, reverseDepsGraph: Record<EntityId, EntityId[]>): EntityId[] => {
    const deps = reverseDepsGraph[componentId]
    if (!deps?.length) {
        return []
    }

    const result: EntityId[] = []

    const queue: EntityId[] = [...deps]

    while (queue.length) {
        const componentId = queue.shift()!

        if (result.includes(componentId)) {
            continue
        }

        result.push(componentId)

        const deps = reverseDepsGraph[componentId]
        if (!isNotEmpty(deps)) {
            continue
        }

        queue.push(...deps)
    }

    return result
}

const sortAffectedDeps = (affected: EntityId[], depsGraph: Record<EntityId, EntityId[]>): EntityId[] => {
    const subDepsGraph = Object.entries(depsGraph).reduce<Record<EntityId, EntityId[]>>((cur, [componentId, deps]) => {
        if (!affected.includes(componentId)) {
            return cur
        }
        cur[componentId] = deps.filter((depId) => affected.includes(depId))
        return cur
    }, {})

    const result: EntityId[] = []
    const visited = new Set<EntityId>()
    const visiting = new Set<EntityId>()

    const executeSort = (componentId: EntityId) => {
        if (visited.has(componentId)) {
            return
        }

        if (visiting.has(componentId)) {
            throw new FormCrafterError({
                code: errorCodes.circularDepDetected,
                location: 'sortAffectedDeps',
                message: `${getErrorMessages(errorCodes.circularDepDetected)} in sortAffectedDeps. Nodes: ${[...visiting, componentId].join(' -> ')}`,
            })
        }

        visiting.add(componentId)

        for (const depId of subDepsGraph[componentId] || []) {
            executeSort(depId)
        }

        visiting.delete(componentId)
        visited.add(componentId)
        result.push(componentId)
    }

    for (const componentId of affected) {
        executeSort(componentId)
    }

    return result
}

export const buildDepsResolutionOrder = (
    depsGraph: Record<EntityId, EntityId[]>,
    reverseDepsGraph: Record<EntityId, EntityId[]>,
): Record<EntityId, EntityId[]> => {
    const data: Record<EntityId, EntityId[]> = {}

    for (const [componentId] of Object.entries(reverseDepsGraph)) {
        const affected = extractAffectedDeps(componentId, reverseDepsGraph)
        const sortedAffeted = sortAffectedDeps(affected, depsGraph)
        data[componentId] = sortedAffeted
    }

    return data
}
