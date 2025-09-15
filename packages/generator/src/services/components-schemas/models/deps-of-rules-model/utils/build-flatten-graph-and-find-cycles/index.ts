import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraph } from '../../../../../../types'

export const buildFlattenGraphAndFindCycles = (graph: DepsGraph) => {
    const visited = new Set<EntityId>()
    const onStack = new Set<EntityId>()
    const flattenGraph: DepsGraph = {}
    const cycles: EntityId[][] = []

    const dfs = (node: EntityId, path: EntityId[] = []) => {
        if (onStack.has(node)) {
            const idx = path.indexOf(node)
            const cyclePath = path.slice(idx).concat(node)
            cycles.push(cyclePath)
            return
        }

        if (visited.has(node)) {
            return
        }

        onStack.add(node)
        const currentPath = path.concat(node)
        const deps = graph[node] || []
        let sortedDeps = new Set<EntityId>()

        for (const dep of deps) {
            dfs(dep, currentPath)
            sortedDeps.add(dep)
            sortedDeps = new Set([...Array.from(sortedDeps), ...(flattenGraph[dep] || [])])
        }

        const resultDeps = Array.from(sortedDeps)
        if (isNotEmpty(resultDeps)) {
            flattenGraph[node] = resultDeps
        }

        visited.add(node)
        onStack.delete(node)
    }

    for (const node in graph) {
        if (!visited.has(node)) {
            dfs(node)
        }
    }

    return {
        flattenGraph,
        cycles,
        hasCycle: isNotEmpty(cycles),
    }
}
