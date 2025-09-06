import { EntityId, ViewResponsive, ViewsDefinitions } from '@form-crafter/core'
import { isNotNull } from '@form-crafter/utils'
import { combine, createEvent, createStore } from 'effector'

import { init } from './init'
import { ViewsService, ViewsServiceParams } from './types'

export type { ViewsService }

export const createViewsService = ({ initial }: ViewsServiceParams): ViewsService => {
    const $curentViewId = createStore<EntityId | null>(null)
    const $defaultView = createStore<ViewResponsive>(initial.default)
    const $views = createStore<ViewsDefinitions | null>(initial.additionals || null)

    const setViewsEvent = createEvent<ViewsDefinitions>('setViewsEvent')
    const setCurrentViewIdEvent = createEvent<EntityId>('setCurrentViewIdEvent')

    $curentViewId.on(setCurrentViewIdEvent, (_, newId) => newId)
    $views.on(setViewsEvent, (_, newViews) => newViews)

    const currentView = combine($curentViewId, $defaultView, $views, (curentViewId, defaultView, views) =>
        isNotNull(curentViewId) && isNotNull(views) ? views[curentViewId].responsive : defaultView,
    )

    init({})

    return {
        $curentViewId,
        $views,
        setViewsEvent,
        currentView,
        setCurrentViewIdEvent,
    }
}
