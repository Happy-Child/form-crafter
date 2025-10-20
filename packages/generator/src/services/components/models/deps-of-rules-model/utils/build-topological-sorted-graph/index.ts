import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraph, DepsGraphAsSet } from '../../../../../../types'

export const buildTopologicalSortedGraph = (dependentsDraph: DepsGraphAsSet, depsGraph: DepsGraphAsSet) => {
    const sortedGraph: DepsGraph = {}

    for (const [componentId, dependentsToSort] of Object.entries(dependentsDraph)) {
        const sortedDeps: EntityId[] = []
        const visited = new Set<EntityId>()
        const onStack = new Set<EntityId>()

        const executeSort = (depId: EntityId, path: string[] = []) => {
            if (onStack.has(depId)) {
                return
            }

            if (visited.has(depId)) {
                return
            }

            onStack.add(depId)
            const currentPath = path.concat(depId)

            for (const supDepId of depsGraph[depId] || new Set()) {
                if (dependentsToSort.has(supDepId)) {
                    executeSort(supDepId, currentPath)
                }
            }

            visited.add(depId)
            onStack.delete(depId)

            sortedDeps.push(depId)
        }

        for (const depId of dependentsToSort) {
            if (!visited.has(depId)) {
                executeSort(depId)
            }
        }

        if (isNotEmpty(sortedDeps)) {
            sortedGraph[componentId] = sortedDeps
        }
    }

    return sortedGraph
}
