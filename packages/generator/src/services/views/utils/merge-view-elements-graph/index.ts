import { Breakpoint, EntityId, ResponsiveViewElementsGraph } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

import { getEmptyViewElementsGraph } from '../../consts'

type Params = {
    responsiveViewElementsGraph: ResponsiveViewElementsGraph
    responsiveViewToMerge: ResponsiveViewElementsGraph
    rootComponentId: EntityId
}

export const mergeViewElementsGraph = ({ responsiveViewElementsGraph, responsiveViewToMerge, rootComponentId }: Params) => {
    const newViewsElementsGraphs: ResponsiveViewElementsGraph = { ...responsiveViewElementsGraph }

    Object.entries(responsiveViewToMerge).forEach(([breakpoint, elementsGraphToMerge]) => {
        if (!isNotEmpty(elementsGraphToMerge.rows.root) && !isNotEmpty(elementsGraphToMerge.rows.graph)) {
            return
        }

        const rootRow = elementsGraphToMerge.rows.graph[elementsGraphToMerge.rows.root[0]]
        rootRow.parentComponentId = rootComponentId
        delete elementsGraphToMerge.rows.graph[rootRow.id]

        const breakpointData = breakpoint in newViewsElementsGraphs ? { ...newViewsElementsGraphs[breakpoint as Breakpoint]! } : getEmptyViewElementsGraph()

        breakpointData.components[rootComponentId] = {
            ...breakpointData.components[rootComponentId],
            childrenRows: [...breakpointData.components[rootComponentId].childrenRows, rootRow.id],
        }
        breakpointData.components = {
            ...breakpointData.components,
            ...elementsGraphToMerge.components,
        }
        breakpointData.rows.graph = {
            ...breakpointData.rows.graph,
            ...elementsGraphToMerge.rows.graph,
            [rootRow.id]: rootRow,
        }

        newViewsElementsGraphs[breakpoint as Breakpoint] = breakpointData
    })

    return newViewsElementsGraphs
}
