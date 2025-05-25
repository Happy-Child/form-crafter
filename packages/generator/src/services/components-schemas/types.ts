import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { EventCallable, StoreWritable } from 'effector'

import { ThemeService } from '../theme'
import { ComponentSchemaModel } from './models'

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

export type SchemaMap = Map<EntityId, ComponentSchemaModel>

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

export type CalcRelationsRulesPayload = { id: EntityId; data: OptionalSerializableObject }
