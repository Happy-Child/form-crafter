import { EntityId, ViewResponsive, Views, ViewsDefinitions } from '@form-crafter/core'
import { EventCallable, Store, StoreWritable } from 'effector'

export type ViewsService = {
    $curentViewId: StoreWritable<EntityId | null>
    $views: StoreWritable<ViewsDefinitions | null>
    setCurrentViewIdEvent: EventCallable<EntityId>
    setViewsEvent: EventCallable<ViewsDefinitions>
    currentView: Store<ViewResponsive>
}

export type ViewsServiceParams = {
    initial: Views
}
