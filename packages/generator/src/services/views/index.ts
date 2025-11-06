import { EntityId, ViewDefinition } from '@form-crafter/core'
import { isNotEmpty, isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { readonly } from 'patronum'

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
    const mergeViewsElementsGraphs = createEvent<UnitValue<typeof setViewsElementsGraphs>>('mergeViewsElementsGraphs')
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
        fn: ({ viewsElementsGraphs }, viewsElementsGraphsToMerge) => {
            console.log('viewsElementsGraphs: ', viewsElementsGraphs)
            console.log('viewsElementsGraphsToMerge: ', viewsElementsGraphsToMerge)

            return viewsElementsGraphs
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
