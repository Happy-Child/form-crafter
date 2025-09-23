import { EntityId, ViewDefinition, ViewResponsive, Views } from '@form-crafter/core'
import { EventCallable, Store, StoreWritable } from 'effector'

export type ViewsService = {
    $curentViewId: StoreWritable<EntityId | null>
    $additionalsViews: StoreWritable<ViewDefinition[]>
    $additionalsViewsObj: Store<Record<EntityId, ViewDefinition>>
    setCurrentViewIdEvent: EventCallable<EntityId | null>
    setAdditionalViewsEvent: EventCallable<ViewDefinition[]>
    currentView: Store<ViewResponsive>
}

export type ViewsServiceParams = {
    initial: Views
}
