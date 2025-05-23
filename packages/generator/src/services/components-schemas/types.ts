import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { EventCallable, StoreWritable } from 'effector'

import { ThemeService } from '../theme'
import { ComponentSchemaFactory } from './factories'

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

export type SchemaMap = Map<EntityId, ComponentSchemaFactory>

export type ComponentsSchemasService = {
    $schemasMap: StoreWritable<SchemaMap>
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
    updateComponentPropertiesEvent: EventCallable<UpdateComponentPropertiesPayload>
}

export type ComponentsSchemasServiceParams = {
    initial: ComponentsSchemas
    themeService: ThemeService
}
