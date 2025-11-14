import { Breakpoint, EntityId, ResponsiveViewElementsGraph, ViewElementsGraph } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

import { getEmptyResponsiveViewElementsGraph } from '../../consts'

const filterViewElementsGraph = (rowIdToRemove: EntityId, viewElementsGraph: ViewElementsGraph) => {
    const componentsIdsToRemove: EntityId[] = []
    const newViewElementsGraph: ViewElementsGraph = { components: { ...viewElementsGraph.components }, rows: { ...viewElementsGraph.rows } }

    const execute = (rowId: EntityId) => {
        const row = newViewElementsGraph.rows.graph[rowId]
        if (!row) {
            console.warn(`[filterViewElementsGraph] Not found row id: "${rowId}".`)
            return
        }

        row.childrenComponents.forEach((componentId) => {
            const component = newViewElementsGraph.components[componentId]

            if (!component) {
                console.warn(`[filterViewElementsGraph] Not found componentId id: "${componentId}".`)
                return
            }

            if (isNotEmpty(component.childrenRows)) {
                component.childrenRows.forEach(execute)
            }

            delete newViewElementsGraph.components[componentId]
            componentsIdsToRemove.push(componentId)
        })

        delete newViewElementsGraph.rows.graph[rowId]
    }
    execute(rowIdToRemove)

    return { viewElementsGraph: newViewElementsGraph, componentsIdsToRemove }
}

type Params = { responsiveViewElementsGraph: ResponsiveViewElementsGraph; parentComponentId: EntityId; rowIndex: number }

export const deepRemoveViewElement = ({ responsiveViewElementsGraph, parentComponentId, rowIndex }: Params) => {
    const componentsIdsToRemove: EntityId[] = []

    const viewElements = Object.entries(responsiveViewElementsGraph).reduce<ResponsiveViewElementsGraph>((result, [breakpoint, currentViewElementsGraph]) => {
        const componentElement = currentViewElementsGraph.components[parentComponentId]
        if (!isNotEmpty(componentElement)) {
            return responsiveViewElementsGraph
        }

        const rowId = componentElement.childrenRows[rowIndex]
        if (isEmpty(rowId)) {
            console.warn(`[removeRowIdDeepViewGraph] Not found row id: "${rowId}".`)
            return result
        }

        const { viewElementsGraph, componentsIdsToRemove: idsToRemove } = filterViewElementsGraph(rowId, currentViewElementsGraph)

        const rootComponent = viewElementsGraph.components[parentComponentId]
        viewElementsGraph.components[parentComponentId] = {
            ...rootComponent,
            childrenRows: rootComponent.childrenRows.filter((_, index) => index !== rowIndex),
        }

        result[breakpoint as Breakpoint] = viewElementsGraph
        componentsIdsToRemove.push(...idsToRemove)

        return result
    }, getEmptyResponsiveViewElementsGraph())

    return { viewElements, componentsIdsToRemove }
}
