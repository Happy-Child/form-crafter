import { EntityId } from '@form-crafter/core'

import { DepsGraphAsSet } from '../../../../../../types'

export const removeNodesFromDepsGraphs = (entityIdToDeps: DepsGraphAsSet, entityIdToDependents: DepsGraphAsSet, nodesToRemove: Set<EntityId>) => {
    return { entityIdToDeps, entityIdToDependents }
}
