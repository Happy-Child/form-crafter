import { EntityId, ViewElements } from '@form-crafter/core'
import { isNotEmpty, isNull } from '@form-crafter/utils'

import { ViewElementsGraph } from '../../types'

export const extractViewElements = (
    elements: ViewElements,
    parentComponentId: EntityId | null = null,
    result: ViewElementsGraph = { rows: { root: [], graph: {} }, components: {} },
) => {
    if (!isNotEmpty(elements)) {
        return result
    }

    elements.forEach((row) => {
        if (row.id in result.rows) {
            console.warn(`[extractViewElements] Duplicate row id detected: "${row.id}".`)
        }

        const children = row?.children || []
        children.forEach(({ id, children = [], layout }) => {
            if (id in result.components) {
                console.warn(`[extractViewElements] Duplicate component id detected: "${id}".`)
            }

            const { rows, components } = extractViewElements(children, id, result)
            result.rows = rows
            result.components = components

            const childrenRows = Array.from(new Set(children?.map(({ id }) => id)) || [])
            result.components[id] = { id, parentRowId: row.id, childrenRows, layout }
        })

        if (isNull(parentComponentId)) {
            result.rows.root.push(row.id)
        }

        const childrenComponents = Array.from(new Set(children?.map(({ id }) => id)) || [])
        result.rows.graph[row.id] = { id: row.id, parentComponentId, childrenComponents }
    })

    return result
}
