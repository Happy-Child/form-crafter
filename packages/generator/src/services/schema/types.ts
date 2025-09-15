import { ComponentsSchemas, EntityId, Schema, SchemaLayout, ValidationRuleSchema } from '@form-crafter/core'
import { Store } from 'effector'

export type GroupValidationRuleSchemas = Record<EntityId, ValidationRuleSchema>

export type ComponentsValidationRuleSchemas = Record<EntityId, { ownerComponentId: EntityId; schema: ValidationRuleSchema }>

export type SchemaService = {
    $schema: Store<Schema>
    $layout: Store<Required<SchemaLayout>>
    $initialComponentsSchemas: Store<ComponentsSchemas>
    $additionalTriggers: Store<string[]>
    $groupValidationSchemas: Store<GroupValidationRuleSchemas>
    $componentsValidationSchemas: Store<ComponentsValidationRuleSchemas>
}

export type SchemaServiceParams = {
    schema: Schema
}
