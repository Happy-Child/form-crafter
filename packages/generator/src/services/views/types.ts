import { EntityId, ViewDefinition, ViewResponsive, Views } from '@form-crafter/core'
import { EventCallable, Store, StoreWritable } from 'effector'

export type ViewsService = {
    $curentViewId: StoreWritable<EntityId | null>
    $additionalsViews: StoreWritable<ViewDefinition[]>
    $additionalsViewsObj: Store<Record<EntityId, ViewDefinition>>
    $currentView: Store<ViewResponsive>
    $currentViewComponents: Store<Set<EntityId>>
    setCurrentViewIdEvent: EventCallable<EntityId | null>
    setAdditionalViewsEvent: EventCallable<ViewDefinition[]>
}

export type ViewsServiceParams = {
    initial: Views
}
