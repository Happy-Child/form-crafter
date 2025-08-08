import {
    ComponentSchema,
    ComponentsSchemas,
    ComponentType,
    ComponentValidationError,
    ContainerComponentProperties,
    ContainerComponentSchema,
    EditableComponentProperties,
    EditableComponentSchema,
    EntityId,
    RepeaterComponentSchema,
    RuleExecutorContext,
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

export type GeneralModelParams = {}

export type ComponentModelParams = {
    $componentsSchemas: Store<ComponentsSchemas>
    $getExecutorContextBuilder: Store<() => RuleExecutorContext>
    $readyConditionalValidationRules: StoreWritable<ReadyValidationsRules>
    $readyConditionalValidationRulesByRuleName: StoreWritable<ReadyValidationsRulesByRuleName>
    $visibleValidationErrors: Store<ComponentsValidationErrors>
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
    runRelationRulesEvent: EventCallable<CalcRelationRulesPayload>
    setComponentValidationErrorsEvent: EventCallable<SetComponentValidationErrorsPayload>
    removeComponentValidationErrorsEvent: EventCallable<EntityId>
    removeAllValidationErrorsEvent: EventCallable<EntityId>
}

export type EditableModel = {
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

export type ContainerModel = {
    $schema: StoreWritable<ContainerComponentSchema>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export type RepeaterModel = {
    $schema: StoreWritable<RepeaterComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type UploaderModel = {
    $schema: StoreWritable<UploaderComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type StaticModel = {
    $schema: StoreWritable<StaticComponentSchema>
    setSchemaEvent: EventCallable<OptionalSerializableObject>
}

export type ComponentModel = EditableModel | ContainerModel | RepeaterModel | UploaderModel | StaticModel

export type ComponentModelByType<T extends ComponentType> = T extends 'editable'
    ? EditableModel
    : T extends 'container'
      ? ContainerModel
      : T extends 'repeater'
        ? RepeaterModel
        : T extends 'uploader'
          ? UploaderModel
          : T extends 'static'
            ? StaticModel
            : never

export type ComponentsModels = Map<EntityId, ComponentModel>
