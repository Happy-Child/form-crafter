import { ViewElementsGraph } from '@form-crafter/core'
import { isEmpty } from '@form-crafter/utils'

import { EntityId } from '../../../../core/src/types'

export const getComponentDepth = (initialComponentId: EntityId, viewElementsGraph: ViewElementsGraph): number => {
    const execute = (componentId: EntityId, depth: number): number => {
        const { parentRowId } = viewElementsGraph.components[componentId]
        const { parentComponentId } = viewElementsGraph.rows.graph[parentRowId]

        if (isEmpty(parentComponentId)) {
            return depth
        }

        return execute(parentComponentId, depth + 1)
    }

    return execute(initialComponentId, 0)
}
