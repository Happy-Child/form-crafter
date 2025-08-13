import { EntityId, errorCodes, FormCrafterError, getErrorMessages } from '@form-crafter/core'

export const topologicalSortDeps = (depsToSort: EntityId[], entityIdToDeps: Record<EntityId, EntityId[]>): EntityId[] => {
    const subDepsGraph = Object.entries(entityIdToDeps).reduce<Record<EntityId, EntityId[]>>((cur, [componentId, deps]) => {
        if (!depsToSort.includes(componentId)) {
            return cur
        }
        cur[componentId] = deps.filter((depId) => depsToSort.includes(depId))
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
                location: 'topologicalSortDeps',
                message: `${getErrorMessages(errorCodes.circularDepDetected)} in topologicalSortDeps. Nodes: ${[...visiting, componentId].join(' -> ')}`,
            })
        }

        visiting.add(componentId)

        for (const supDepId of subDepsGraph[componentId] || []) {
            executeSort(supDepId)
        }

        visiting.delete(componentId)
        visited.add(componentId)
        result.push(componentId)
    }

    for (const depId of depsToSort) {
        executeSort(depId)
    }

    return result
}
