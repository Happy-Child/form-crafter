import { ComponentSchema, ComponentsSchemas, EntityId, RuleExecutorContext } from '@form-crafter/core'
import { Store } from 'effector'

import { ComponentModel } from '../components'

export type ComponentsModels = Map<EntityId, ComponentModel>

export type GetExecutorContextBuilder = Store<(params?: { componentsSchemas?: ComponentsSchemas }) => RuleExecutorContext>

export type ComponentToUpdate = {
    componentId: EntityId
    schema: ComponentSchema
    isNewValue?: boolean
}
