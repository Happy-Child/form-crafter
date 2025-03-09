import { EntityId } from '@form-crafter/core'
import { EventCallable } from 'effector'

import { ComponentsSchemasService } from '../components-schemas'
import { ViewsService } from '../views'

export type AddChildPayload = { repeaterId: EntityId }

export type RemoveChildPayload = { repeaterId: EntityId; rowId: EntityId }

export type RepeaterService = {
    addChildEvent: EventCallable<AddChildPayload>
    removeChildEvent: EventCallable<RemoveChildPayload>
}

export type RepeaterServiceParams = {
    componentsSchemasService: ComponentsSchemasService
    viewsService: ViewsService
}
