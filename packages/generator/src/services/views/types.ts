import { EntityId, ViewDefinition, Views, ViewsDefinitions } from '@form-crafter/core'
import { EventCallable, Store, StoreWritable } from 'effector'

export type ViewsService = {
    $curentViewId: StoreWritable<EntityId>
    $views: StoreWritable<ViewsDefinitions>
    setCurrentViewIdEvent: EventCallable<EntityId>
    setViewsEvent: EventCallable<ViewsDefinitions>
    currentView: Store<ViewDefinition>
}

export type ViewsServiceParams = {
    initial: Views
}
