import { EntityId, ViewElements, ViewElementsGraph } from '@form-crafter/core'
import { isNotEmpty, isNull } from '@form-crafter/utils'

type Slots = { getRowId?: (id: EntityId) => EntityId; getComponentId?: (id: EntityId) => EntityId }

export const buildViewElementsGraph = (elements: ViewElements, slots: Slots = {}) => {
    const execute = (
        elements: ViewElements,
        parentComponentId: EntityId | null = null,
        result: ViewElementsGraph = { rows: { root: [], graph: {} }, components: {} },
    ) => {
        const { getRowId = (id: EntityId) => id, getComponentId = (id: EntityId) => id } = slots

        if (!isNotEmpty(elements)) {
            return result
        }

        elements.forEach((row) => {
            const finalRowId = getRowId(row.id)

            if (finalRowId in result.rows) {
                console.warn(`[buildViewElementsGraph] Duplicate row id detected: "${finalRowId}".`)
            }

            const children = row?.children || []
            children.forEach(({ id: componentId, children = [], layout }) => {
                const finalComponentId = getComponentId(componentId)

                if (finalComponentId in result.components) {
                    console.warn(`[buildViewElementsGraph] Duplicate component id detected: "${finalComponentId}".`)
                }

                const { rows, components } = execute(children, finalComponentId, result)
                result.rows = rows
                result.components = components

                const childrenRows = Array.from(new Set(children?.map(({ id }) => getRowId(id))) || [])
                result.components[finalComponentId] = { id: finalComponentId, parentRowId: finalRowId, childrenRows, layout }
            })

            if (isNull(parentComponentId)) {
                result.rows.root.push(finalRowId)
            }

            const childrenComponents = Array.from(new Set(children?.map(({ id }) => getComponentId(id))) || [])
            result.rows.graph[finalRowId] = { id: finalRowId, parentComponentId, childrenComponents }
        })

        return result
    }

    return execute(elements)
}
