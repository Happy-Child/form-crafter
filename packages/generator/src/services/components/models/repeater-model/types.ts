import { EntityId } from '@form-crafter/core'

import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'

export type AddGroupPayload = { repeaterId: EntityId }

export type RemoveGroupPayload = { repeaterId: EntityId; rowId: EntityId }

export type RepeaterModelParams = {
    componentsModel: ComponentsModel
    viewsService: ViewsService
}
