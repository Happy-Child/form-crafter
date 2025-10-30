import { EntityId, ViewDefinition, ViewResponsive } from '@form-crafter/core'
import { isNotEmpty, isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore, UnitValue } from 'effector'

import { init } from './init'
import { ViewsServiceParams } from './types'

export type ViewsService = ReturnType<typeof createViewsService>

export const createViewsService = ({ initial }: ViewsServiceParams) => {
    const $curentViewId = createStore<EntityId | null>(null)
    const $defaultView = createStore<ViewResponsive>(initial.default)
    const $additionalsViews = createStore<ViewDefinition[]>(initial.additionals || [])

    const setAdditionalViews = createEvent<UnitValue<typeof $additionalsViews>>('setAdditionalViews')
    const setCurrentViewId = createEvent<UnitValue<typeof $curentViewId>>('setCurrentViewId')

    $curentViewId.on(setCurrentViewId, (_, newId) => newId)
    $additionalsViews.on(setAdditionalViews, (_, newViews) => newViews)

    const $additionalsViewsObj = $additionalsViews.map((additionalsViews) =>
        additionalsViews.reduce<Record<EntityId, ViewDefinition>>((map, cur) => ({ ...map, [cur.id]: cur }), {}),
    )

    const $currentView = combine($curentViewId, $defaultView, $additionalsViewsObj, (curentViewId, defaultView, additionalsViewsObj) =>
        isNotNull(curentViewId) && isNotEmpty(additionalsViewsObj) ? additionalsViewsObj[curentViewId].responsive : defaultView,
    )

    const $currentViewComponents = combine(
        $currentView,
        (currentView) => new Set(Object.entries(currentView.xxl.components).map(([componentId]) => componentId)),
    )

    init({})

    return {
        $curentViewId,
        $additionalsViews,
        $additionalsViewsObj,
        $currentView,
        $currentViewComponents,
        setAdditionalViews,
        setCurrentViewId,
    }
}
