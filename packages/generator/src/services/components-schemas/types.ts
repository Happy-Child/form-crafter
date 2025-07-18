import { ComponentSchema, ComponentsSchemas, EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { EventCallable, StoreWritable } from 'effector'

import { SchemaMap } from '../../types'
import { SchemaService } from '../schema'
import { ThemeService } from '../theme'

export type ReadyValidationsRules = Record<EntityId, { readyBySchemaId: Set<EntityId>; readyGroupedByRuleName: Record<string, Set<EntityId>> }>

export type ReadyConditionalValidationsRules = ReadyValidationsRules

export type RulesOverridesCache = Record<EntityId, OptionalSerializableObject | null>

export type RulesDepsFromSchema = {
    relations: {
        entityIdToDeps: Record<EntityId, EntityId[]>
        entityIdToDependents: Record<EntityId, EntityId[]>
    }
    validations: {
        entityIdToDeps: Record<string, EntityId[]>
        entityIdToDependents: Record<EntityId, string[]>
    }
}

export type ValidationRuleSchemas = Record<EntityId, { ownerComponentId: EntityId; schema: ValidationRuleSchema }>

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

export type CalcRelationsRulesPayload = { id: EntityId; data: OptionalSerializableObject }

export type ComponentsSchemasService = {
    $schemasMap: StoreWritable<SchemaMap>
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
    updateComponentPropertiesEvent: EventCallable<UpdateComponentPropertiesPayload>
    initComponentSchemasEvent: EventCallable<void>
}

export type ComponentsSchemasServiceParams = {
    initial: ComponentsSchemas
    themeService: ThemeService
    schemaService: SchemaService
}
