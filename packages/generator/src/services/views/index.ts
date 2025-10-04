import { EntityId, ViewDefinition, ViewResponsive } from '@form-crafter/core'
import { isNotEmpty, isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore, UnitValue } from 'effector'

import { init } from './init'
import { ViewsService, ViewsServiceParams } from './types'

export type { ViewsService }

export const createViewsService = ({ initial }: ViewsServiceParams): ViewsService => {
    const $curentViewId = createStore<EntityId | null>(null)
    const $defaultView = createStore<ViewResponsive>(initial.default)
    const $additionalsViews = createStore<ViewDefinition[]>(initial.additionals || [])

    const setAdditionalViewsEvent = createEvent<UnitValue<typeof $additionalsViews>>('setAdditionalViewsEvent')
    const setCurrentViewIdEvent = createEvent<UnitValue<typeof $curentViewId>>('setCurrentViewIdEvent')

    $curentViewId.on(setCurrentViewIdEvent, (_, newId) => newId)
    $additionalsViews.on(setAdditionalViewsEvent, (_, newViews) => newViews)

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
        setAdditionalViewsEvent,
        setCurrentViewIdEvent,
    }
}
