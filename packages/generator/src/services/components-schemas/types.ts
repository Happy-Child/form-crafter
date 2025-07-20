import { ComponentSchema, ComponentsSchemas, ComponentValidationError, EntityId, ValidationRuleSchema } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { Effect, EventCallable, Store, StoreWritable } from 'effector'

import { SchemaMap } from '../../types'
import { SchemaService } from '../schema'
import { ThemeService } from '../theme'
import { RunValidationFxDone, RunValidationFxFail } from './models/types'

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

export type ComponentsValidationErrors = Record<EntityId, ComponentValidationError[]>

export type UpdateComponentPropertiesPayload = {
    id: EntityId
    data: Partial<ComponentSchema['properties']>
}

export type CalcRelationsRulesPayload = { id: EntityId; data: OptionalSerializableObject }

export type ComponentsSchemasService = {
    runValidationAllComponentsFx: Effect<void, RunValidationFxDone[], RunValidationFxFail[]>
    updateComponentsSchemasEvent: EventCallable<ComponentsSchemas>
    removeComponentsSchemasByIdsEvent: EventCallable<{ ids: EntityId[] }>
    updateComponentPropertiesEvent: EventCallable<UpdateComponentPropertiesPayload>
    initComponentSchemasEvent: EventCallable<void>
    $schemasMap: StoreWritable<SchemaMap>
    $isValidationComponentsPending: StoreWritable<boolean>
    $componentsIsValid: Store<boolean>
}

export type ComponentsSchemasServiceParams = {
    initial: ComponentsSchemas
    themeService: ThemeService
    schemaService: SchemaService
}
