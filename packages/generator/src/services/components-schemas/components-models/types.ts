import {
    ComponentSchema,
    ComponentType,
    ComponentValidationError,
    ContainerComponentProperties,
    ContainerComponentSchema,
    EditableComponentProperties,
    EditableComponentSchema,
    EntityId,
    RepeaterComponentSchema,
    StaticComponentSchema,
    UploaderComponentProperties,
    UploaderComponentSchema,
    ValidationsTriggers,
} from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { Effect, EventCallable, Store, StoreWritable } from 'effector'

import { ThemeService } from '../../theme'
import { CalcRelationRulesPayload, ReadyValidationsRules, ReadyValidationsRulesByRuleName } from '../types'
import { ComponentsValidationErrors, SetComponentValidationErrorsPayload } from '../validations-errors-model'

export type RunComponentValidationFxDone = {}

export type RunComponentValidationFxFail = { errors: ComponentsValidationErrors[keyof ComponentsValidationErrors] }

export type GeneralSchemaModelParams = {}

export type ComponentSchemaModelParams = {
    $componentsSchemasModel: StoreWritable<ComponentsSchemasModel>
    $readyConditionalValidationRules: StoreWritable<ReadyValidationsRules>
    $readyConditionalValidationRulesByRuleName: StoreWritable<ReadyValidationsRulesByRuleName>
    $validationErrors: Store<ComponentsValidationErrors>
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
    runRelationRulesEvent: EventCallable<CalcRelationRulesPayload>
    setComponentValidationErrorsEvent: EventCallable<SetComponentValidationErrorsPayload>
    removeValidationErrorsEvent: EventCallable<EntityId>
}

export type EditableSchemaModel = {
    $schema: StoreWritable<EditableComponentSchema>
    $errors: Store<ComponentValidationError[] | null>
    $firstError: Store<ComponentValidationError | null>
    $isRequired: Store<boolean>
    $isValidationPending: StoreWritable<boolean>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
    onBlurEvent: EventCallable<void>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type ContainerSchemaModel = {
    $schema: StoreWritable<ContainerComponentSchema>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export type RepeaterSchemaModel = {
    $schema: StoreWritable<RepeaterComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type UploaderSchemaModel = {
    $schema: StoreWritable<UploaderComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type StaticSchemaModel = {
    $schema: StoreWritable<StaticComponentSchema>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
}

export type ComponentSchemaModel = EditableSchemaModel | ContainerSchemaModel | RepeaterSchemaModel | UploaderSchemaModel | StaticSchemaModel

export type ComponentSchemaModelByType<T extends ComponentType> = T extends 'editable'
    ? EditableSchemaModel
    : T extends 'container'
      ? ContainerSchemaModel
      : T extends 'repeater'
        ? RepeaterSchemaModel
        : T extends 'uploader'
          ? UploaderSchemaModel
          : T extends 'static'
            ? StaticSchemaModel
            : never

export type ComponentsSchemasModel = Map<EntityId, ComponentSchemaModel>
