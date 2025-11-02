import { Breakpoint, EntityId, ViewResponsive, Views } from '@form-crafter/core'
import { isNotEmpty, isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore, UnitValue } from 'effector'

import { init } from './init'
import { ViewsElementsGraphs, ViewsServiceParams } from './types'
import { extractViewElements } from './utils'

export * from './types'

export type ViewsService = ReturnType<typeof createViewsService>

export const createViewsService = ({ initial }: ViewsServiceParams) => {
    const $curentViewId = createStore<EntityId | null>(null)
    const $defaultView = createStore<ViewResponsive>(initial.default)
    const $additionalsViews = createStore<Required<Views>['additionals']>(initial.additionals || {})

    const setAdditionalViews = createEvent<UnitValue<typeof $additionalsViews>>('setAdditionalViews')
    const setCurrentViewId = createEvent<UnitValue<typeof $curentViewId>>('setCurrentViewId')

    $curentViewId.on(setCurrentViewId, (_, newId) => newId)
    $additionalsViews.on(setAdditionalViews, (_, newViews) => newViews)

    const $additionalsViewsArr = $additionalsViews.map((additionalsViews) => Object.values(additionalsViews))

    const $currentView = combine($curentViewId, $defaultView, $additionalsViews, (curentViewId, defaultView, additionalsViews) =>
        isNotNull(curentViewId) && isNotEmpty(additionalsViews) ? additionalsViews[curentViewId].responsive : defaultView,
    )

    const $viewsElementsGraphs = combine($defaultView, $additionalsViews, (defaultView, additionalsViews) => {
        const finalDefault = Object.entries(defaultView).reduce<ViewsElementsGraphs['default']>(
            (result, [breakpoint, { elements }]) => {
                result[breakpoint as Breakpoint] = extractViewElements(elements)
                return result
            },
            { xxl: { rows: { root: [], graph: {} }, components: {} } },
        )
        const additional = Object.entries(additionalsViews).reduce<ViewsElementsGraphs['additional']>((result, [viewId, { responsive }]) => {
            result[viewId] = Object.entries(responsive).reduce<ViewsElementsGraphs['default']>(
                (result, [breakpoint, { elements }]) => {
                    result[breakpoint as Breakpoint] = extractViewElements(elements)
                    return result
                },
                { xxl: { rows: { root: [], graph: {} }, components: {} } },
            )
            return result
        }, {})
        return { default: finalDefault, additional }
    })

    const $currentViewElementsGraph = combine($curentViewId, $viewsElementsGraphs, (curentViewId, viewsElementsGraphs) =>
        isNotNull(curentViewId) && isNotEmpty(viewsElementsGraphs.additional) ? viewsElementsGraphs.additional[curentViewId] : viewsElementsGraphs.default,
    )

    const $currentViewComponents = combine(
        $currentViewElementsGraph,
        (currentViewElementsGraph) => new Set(Object.keys(currentViewElementsGraph.xxl.components)),
    )

    init({})

    return {
        $curentViewId,
        $currentViewElementsGraph,
        $additionalsViews,
        $additionalsViewsArr,
        $currentView,
        $currentViewComponents,
        setAdditionalViews,
        setCurrentViewId,
    }
}
