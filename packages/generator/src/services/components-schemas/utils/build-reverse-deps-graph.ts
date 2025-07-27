import { EntityId } from '@form-crafter/core'

export const buildReverseDepsGraph = (depsGraph: Record<EntityId, EntityId[]>) =>
    Object.entries(depsGraph).reduce<Record<EntityId, EntityId[]>>((graph, [entityId, deps]) => {
        deps.forEach((depId) => {
            if (!graph[depId]) {
                graph[depId] = []
            }
            graph[depId].push(entityId)
        })

        return graph
    }, {})
