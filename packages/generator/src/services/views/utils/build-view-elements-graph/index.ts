import { EntityId, ViewElements } from '@form-crafter/core'
import { genId, isNotEmpty, isNull } from '@form-crafter/utils'

import { ViewElementsGraph } from '../../types'

export const buildViewElementsGraph = (elements: ViewElements, generateRowId?: boolean, componentsIdMap?: Record<EntityId, EntityId>) => {
    const rowIdMap: Record<EntityId, EntityId> = {}

    const execute = (
        elements: ViewElements,
        parentComponentId: EntityId | null = null,
        result: ViewElementsGraph = { rows: { root: [], graph: {} }, components: {} },
    ) => {
        if (!isNotEmpty(elements)) {
            return result
        }

        elements.forEach((row) => {
            let finalRowId = row.id
            if (generateRowId) {
                finalRowId = genId()
                rowIdMap[row.id] = finalRowId
            }

            const children = row?.children || []
            children.forEach(({ id: componentId, children = [], layout }) => {
                const finalComponentId = isNotEmpty(componentsIdMap) ? componentsIdMap[componentId] : componentId
                // if (finalComponentId in result.components) {
                //     console.warn(`[buildViewElementsGraph] Duplicate component id detected: "${finalComponentId}".`)
                // }

                const { rows, components } = execute(children, finalComponentId, result)
                result.rows = rows
                result.components = components

                const childrenRows = Array.from(new Set(children?.map(({ id }) => (generateRowId ? genId() : id))) || [])
                result.components[finalComponentId] = { id: finalComponentId, parentRowId: finalRowId, childrenRows, layout }
            })

            if (isNull(parentComponentId)) {
                result.rows.root.push(finalRowId)
            }

            const childrenComponents = Array.from(new Set(children?.map(({ id }) => (isNotEmpty(componentsIdMap) ? componentsIdMap[id] : id))) || [])
            result.rows.graph[finalRowId] = { id: finalRowId, parentComponentId, childrenComponents }
        })

        return result
    }

    return execute(elements)
}
