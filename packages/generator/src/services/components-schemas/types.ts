import { ComponentSchema, ComponentsSchemas, EntityId, GroupValidationError } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { Effect, EventCallable, Store, StoreWritable } from 'effector'

import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { ComponentsSchemasModel } from './components-models'

export type ReadyValidationsRules = Record<EntityId, Set<EntityId>>

export type ReadyValidationsRulesByRuleName = Record<EntityId, Record<string, Set<EntityId>>>

export type RulesOverridesCache = Record<EntityId, OptionalSerializableObject | null>

export type DepsRuleSchema = {
    schemaIdToDeps: Record<EntityId, EntityId[]>
    schemaIdToDependents: Record<EntityId, EntityId[]>
}

export type DepsComponentRuleSchemas = {
    relations: DepsRuleSchema
    validations: DepsRuleSchema
}

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

export type CalcRelationRulesPayload = { id: EntityId; data: OptionalSerializableObject }

export type RemoveComponentsValidationErrorsPayload = Record<EntityId, Set<EntityId>>

export type ComponentsSchemasService = {
    runFormValidationFx: Effect<void, void>
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
    updateComponentPropertiesEvent: EventCallable<UpdateComponentPropertiesPayload>
    initComponentSchemasEvent: EventCallable<void>
    $componentsSchemasModel: StoreWritable<ComponentsSchemasModel>
    $isValidationPending: Store<boolean>
    $groupValidationErrors: Store<GroupValidationError[]>
    $formIsValid: Store<boolean>
}

export type ComponentsSchemasServiceParams = {
    initial: ComponentsSchemas
    themeService: ThemeService
    schemaService: SchemaService
}
