import { ComponentSchema, ComponentsSchemas, EntityId } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { EventCallable, StoreWritable } from 'effector'

import { SchemaMap } from '../../types'
import { ThemeService } from '../theme'

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

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

export type RulesOverridesCacheStore = Record<EntityId, OptionalSerializableObject | null>

export type ComponentsDepsFromSchemaStore = {
    depsGraph: Record<EntityId, EntityId[]>
    reverseDepsGraph: Record<EntityId, EntityId[]>
}
