import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { EventCallable, StoreWritable } from 'effector'

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

export type ComponentsSchemasService = {
    $schemas: StoreWritable<ComponentsSchemas>
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
    updateComponentPropertiesEvent: EventCallable<UpdateComponentPropertiesPayload>
}

export type ComponentsSchemasServiceParams = {
    initial: ComponentsSchemas
}
