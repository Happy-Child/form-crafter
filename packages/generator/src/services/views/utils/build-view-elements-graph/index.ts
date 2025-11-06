import { EntityId, ViewElements } from '@form-crafter/core'
import { isNotEmpty, isNull } from '@form-crafter/utils'

import { ViewElementsGraph } from '../../types'

export const buildViewElementsGraph = (elements: ViewElements, componentsIdMap?: Record<EntityId, EntityId>) => {
    console.log('componentsIdMap: ', componentsIdMap)

    const execute = (
        elements: ViewElements,
        parentComponentId: EntityId | null = null,
        result: ViewElementsGraph = { rows: { root: [], graph: {} }, components: {} },
    ) => {
        if (!isNotEmpty(elements)) {
            return result
        }

        elements.forEach((row) => {
            if (row.id in result.rows) {
                console.warn(`[buildViewElementsGraph] Duplicate row id detected: "${row.id}".`)
            }

            const children = row?.children || []
            children.forEach(({ id, children = [], layout }) => {
                console.log('comp id: ', id)
                const finalId = isNotEmpty(componentsIdMap) ? componentsIdMap[id] : id
                if (finalId in result.components) {
                    console.warn(`[buildViewElementsGraph] Duplicate component id detected: "${finalId}".`)
                }

                const { rows, components } = execute(children, finalId, result)
                result.rows = rows
                result.components = components

                const childrenRows = Array.from(new Set(children?.map(({ id }) => id)) || [])
                result.components[finalId] = { id: finalId, parentRowId: row.id, childrenRows, layout }
            })

            if (isNull(parentComponentId)) {
                result.rows.root.push(row.id)
            }

            const childrenComponents = Array.from(new Set(children?.map(({ id }) => id)) || [])
            result.rows.graph[row.id] = { id: row.id, parentComponentId, childrenComponents }
        })

        return result
    }

    return execute(elements)
}
