import { EntityId, ViewsDefinitions } from '@form-crafter/core'
import { combine, createEvent, createStore } from 'effector'

import { init } from './init'
import { ViewsService, ViewsServiceParams } from './types'

export type { ViewsService }

export const createViewsService = ({ initial }: ViewsServiceParams): ViewsService => {
    const $curentViewId = createStore<EntityId>(initial.initialViewId)
    const $views = createStore<ViewsDefinitions>(initial.definitions)

    const setViewsEvent = createEvent<ViewsDefinitions>('setViewsEvent')
    const setCurrentViewIdEvent = createEvent<EntityId>('setCurrentViewIdEvent')

    $curentViewId.on(setCurrentViewIdEvent, (_, newId) => newId)
    $views.on(setViewsEvent, (_, newViews) => newViews)

    const currentView = combine($curentViewId, $views, (id, views) => views[id])

    init({})

    return {
        $curentViewId,
        $views,
        setViewsEvent,
        currentView,
        setCurrentViewIdEvent,
    }
}
