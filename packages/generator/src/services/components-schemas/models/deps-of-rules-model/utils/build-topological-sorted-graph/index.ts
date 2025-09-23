import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraph } from '../../../../../../types'

export const buildTopologicalSortedGraph = (dependentsDraph: DepsGraph, depsGraph: DepsGraph) => {
    const sortedGraph: DepsGraph = {}

    for (const [componentId, dependentsToSort] of Object.entries(dependentsDraph)) {
        const filteredDepsGraph = Object.entries(depsGraph).reduce<DepsGraph>((cur, [componentId, deps]) => {
            if (!dependentsToSort.includes(componentId)) {
                return cur
            }
            cur[componentId] = deps.filter((depId) => dependentsToSort.includes(depId))
            return cur
        }, {})

        const sortedDeps: EntityId[] = []
        const visited = new Set<EntityId>()
        const onStack = new Set<EntityId>()

        const executeSort = (node: EntityId, path: string[] = []) => {
            if (onStack.has(node)) {
                return
            }

            if (visited.has(node)) {
                return
            }

            onStack.add(node)
            const currentPath = path.concat(node)

            for (const supDepId of filteredDepsGraph[node] || []) {
                executeSort(supDepId, currentPath)
            }

            visited.add(node)
            onStack.delete(node)

            sortedDeps.push(node)
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
