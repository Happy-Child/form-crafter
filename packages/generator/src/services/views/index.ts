import { Breakpoint, EntityId, ViewDefinition } from '@form-crafter/core'
import { genId, isNotEmpty, isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { cloneDeep } from 'lodash-es'
import { readonly } from 'patronum'

import { getEmptyViewElementsGraph } from './consts'
import { ViewsElementsGraphs, ViewsServiceParams } from './types'
import { buildViewElementsGraphs, selectViewByBreakpoint } from './utils'

export * from './types'

export { buildViewElementsGraphs }

export type ViewsService = ReturnType<typeof createViewsService>

export const createViewsService = ({ initial, generalService }: ViewsServiceParams) => {
    const $curentViewId = createStore<EntityId | null>(null)

    const $additionalViewsConditions = readonly(
        createStore<Pick<ViewDefinition, 'id' | 'condition'>[]>(Object.entries(initial.additionals || {}).map(([id, { condition }]) => ({ id, condition }))),
    )

    const $viewsElementsGraphs = createStore<ViewsElementsGraphs>(buildViewElementsGraphs(initial.default, initial.additionals || {}))

    const setViewsElementsGraphs = createEvent<UnitValue<typeof $viewsElementsGraphs>>('setViewsElementsGraphs')
    const mergeViewsElementsGraphs = createEvent<{ graphsToMerge: UnitValue<typeof setViewsElementsGraphs>; rootComponentId: EntityId }>(
        'mergeViewsElementsGraphs',
    )
    const setCurrentViewId = createEvent<UnitValue<typeof $curentViewId>>('setCurrentViewId')

    $curentViewId.on(setCurrentViewId, (_, newId) => newId)
    $viewsElementsGraphs.on(setViewsElementsGraphs, (_, newGraphs) => newGraphs)

    const $currentViewElementsGraph = combine(
        $curentViewId,
        $viewsElementsGraphs,
        generalService.$currentBreakpoint,
        (curentViewId, viewsElementsGraphs, breakpoint) => {
            const isAdditionalView = isNotNull(curentViewId) && isNotEmpty(viewsElementsGraphs.additional)
            const finalViewResponsiveGraph = isAdditionalView ? viewsElementsGraphs.additional[curentViewId] : viewsElementsGraphs.default
            return selectViewByBreakpoint(breakpoint, finalViewResponsiveGraph)
        },
    )

    const $currentViewComponents = combine($currentViewElementsGraph, (currentViewElementsGraph) => new Set(Object.keys(currentViewElementsGraph.components)))

    sample({
        source: { viewsElementsGraphs: $viewsElementsGraphs },
        clock: mergeViewsElementsGraphs,
        fn: ({ viewsElementsGraphs }, { graphsToMerge, rootComponentId }) => {
            console.log('mergeViewsElementsGraphs')

            console.log('viewsElementsGraphs: ', cloneDeep(viewsElementsGraphs))
            console.log('graphsToMerge: ', cloneDeep(graphsToMerge))

            const newViewsElementsGraphs = cloneDeep(viewsElementsGraphs)

            Object.entries(graphsToMerge.default).forEach(([breakpoint, data]) => {
                const rootRow = data.rows.graph[data.rows.root[0]]
                rootRow.parentComponentId = rootComponentId
                delete data.rows.graph[rootRow.id]

                if (!(breakpoint in newViewsElementsGraphs.default)) {
                    newViewsElementsGraphs.default[breakpoint as Breakpoint] = getEmptyViewElementsGraph()
                }
                const breakpointData = newViewsElementsGraphs.default[breakpoint as Breakpoint]!

                breakpointData.components[rootComponentId] = {
                    ...breakpointData.components[rootComponentId],
                    childrenRows: [...breakpointData.components[rootComponentId].childrenRows, rootRow.id],
                }
                breakpointData.components = {
                    ...breakpointData.components,
                    ...data.components,
                }

                breakpointData.rows.graph = {
                    ...breakpointData.rows.graph,
                    ...data.rows.graph,
                    [rootRow.id]: rootRow,
                }
            })

            console.log('newViewsElementsGraphs: ', cloneDeep(newViewsElementsGraphs))

            return newViewsElementsGraphs
        },
        target: setViewsElementsGraphs,
    })

    return {
        $curentViewId,
        $additionalViewsConditions,
        $currentViewElementsGraph,
        $currentViewComponents,
        setCurrentViewId,
        mergeViewsElementsGraphs,
    }
}
