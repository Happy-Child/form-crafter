import { DepsGraphAsSet } from '../../../../../../types'

export const buildReverseDepsGraph = (depsGraph: DepsGraphAsSet) =>
    Object.entries(depsGraph).reduce<DepsGraphAsSet>((graph, [entityId, deps]) => {
        deps.forEach((depId) => {
            if (!(depId in graph)) {
                graph[depId] = new Set()
            }
            graph[depId].add(entityId)
        })

        return graph
    }, {})
