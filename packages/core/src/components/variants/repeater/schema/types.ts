import { EntityId } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

import { Views } from '../../../../views'
import { ComponentMeta, GeneralComponentSchema } from '../../../schema'
import { ContainerComponentSchema } from '../../container'
import { EditableComponentSchema } from '../../editable'
import { StaticComponentSchema } from '../../static'

export type RepeaterComponentProperties = AvailableObject

export type RepeaterComponentSchema<T extends RepeaterComponentProperties = RepeaterComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'repeater'>
    template: {
        views: Views<'template'>
        containerSchema: ContainerComponentSchema
        componentsSchemas: Record<EntityId, EditableComponentSchema | ContainerComponentSchema | RepeaterComponentSchema | StaticComponentSchema>
    }
    properties: T
}
