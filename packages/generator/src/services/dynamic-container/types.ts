import { EntityId } from '@form-crafter/core'
import { EventCallable } from 'effector'

import { ComponentsSchemasService } from '../components-schemas'
import { ViewsService } from '../views'

export type AddDynamicContainerChildPayload = { dynamicContainerId: EntityId }

export type RemoveDynamicContainerChildPayload = { dynamicContainerId: EntityId; rowId: EntityId }

export type DynamicContainerService = {
    addDynamicContainerChildEvent: EventCallable<AddDynamicContainerChildPayload>
    removeDynamicContainerChildEvent: EventCallable<RemoveDynamicContainerChildPayload>
}

export type DynamicContainerParams = {
    componentsSchemasService: ComponentsSchemasService
    viewsService: ViewsService
}
