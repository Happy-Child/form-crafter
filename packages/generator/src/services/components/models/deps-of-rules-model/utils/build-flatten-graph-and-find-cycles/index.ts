import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraphAsSet } from '../../../../../../types'

export const buildFlattenGraphAndFindCycles = (rawDeps: DepsGraphAsSet) => {
    const visited = new Set<EntityId>()
    const onStack = new Set<EntityId>()
    const flattenGraph: DepsGraphAsSet = {}
    const cycles: EntityId[][] = []

    const dfs = (node: EntityId, path: EntityId[] = []) => {
        const foundCycle = onStack.has(node)
        if (foundCycle) {
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
        const deps = rawDeps[node] || []
        let sortedDeps = new Set<EntityId>()

        for (const dep of deps) {
            dfs(dep, currentPath)
            sortedDeps.add(dep)
            sortedDeps = new Set([...Array.from(sortedDeps), ...(flattenGraph[dep] || [])])
        }

        if (isNotEmpty(sortedDeps)) {
            flattenGraph[node] = sortedDeps
        }

        visited.add(node)
        onStack.delete(node)
    }

    for (const dep in rawDeps) {
        if (!visited.has(dep)) {
            dfs(dep)
        }
    }

    return {
        flattenGraph,
        cycles,
        hasCycle: isNotEmpty(cycles),
    }
}
