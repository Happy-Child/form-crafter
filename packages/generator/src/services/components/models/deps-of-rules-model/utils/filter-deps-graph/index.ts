import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { DepsGraphAsSet } from '../../../../../../types'

export const filterDepsGraph = (graph: DepsGraphAsSet, nodesToFilter: Set<EntityId>) =>
    Object.entries(graph).reduce<DepsGraphAsSet>((result, [entityId, deps]) => {
        if (!nodesToFilter.has(entityId)) {
            return result
        }

        const finalDeps = new Set(Array.from(deps).filter((depId) => nodesToFilter.has(depId)))
        if (isNotEmpty(finalDeps)) {
            result[entityId] = finalDeps
        }

        return result
    }, {})
