import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraphAsSet } from '../../../../../../types'

export const filterDepsGraph = (graph: DepsGraphAsSet, nodesForFilter: Set<EntityId>) =>
    Object.entries(graph).reduce<DepsGraphAsSet>((result, [entityId, deps]) => {
        if (!nodesForFilter.has(entityId)) {
            return result
        }

        const finalDeps = new Set(Array.from(deps).filter((depId) => nodesForFilter.has(depId)))
        if (isNotEmpty(finalDeps)) {
            result[entityId] = finalDeps
        }

        return result
    }, {})
