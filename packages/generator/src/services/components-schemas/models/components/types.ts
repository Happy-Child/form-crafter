import {
    ComponentSchema,
    ComponentType,
    ComponentValidationError,
    ContainerComponentProperties,
    ContainerComponentSchema,
    EditableComponentProperties,
    EditableComponentSchema,
    RepeaterComponentSchema,
    StaticComponentSchema,
    UploaderComponentProperties,
    UploaderComponentSchema,
    ValidationsTriggers,
} from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { Effect, EventCallable, Store, StoreWritable } from 'effector'

import { ThemeService } from '../../../theme'
import { RunMutationsRulesOnUserActionsPayload } from '../../types'
import { ComponentsModel } from '../components-model'
import { ComponentsValidationErrors, ComponentsValidationErrorsModel } from '../components-validation-errors-model'
import { ReadyConditionalValidationRulesModel } from '../ready-conditional-validation-rules-model'

export type RunComponentValidationFxDone = {}

export type RunComponentValidationFxFail = { errors: ComponentsValidationErrors[keyof ComponentsValidationErrors] }

export type GeneralModelParams = {}

export type SetSchemaPayload = { schema: OptionalSerializableObject; isNewValue?: boolean }

export type ComponentModelParams = {
    runMutationsRulesEvent: EventCallable<RunMutationsRulesOnUserActionsPayload>
    componentsModel: ComponentsModel
    readyConditionalValidationRulesModel: ReadyConditionalValidationRulesModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
}

export type EditableModel = {
    $schema: StoreWritable<EditableComponentSchema>
    $errors: Store<ComponentValidationError[] | null>
    $firstError: Store<ComponentValidationError | null>
    $isRequired: Store<boolean>
    $isValidationPending: StoreWritable<boolean>
    setSchemaEvent: EventCallable<SetSchemaPayload>
    onUpdatePropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
    onBlurEvent: EventCallable<void>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type ContainerModel = {
    $schema: StoreWritable<ContainerComponentSchema>
    setSchemaEvent: EventCallable<SetSchemaPayload>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export type RepeaterModel = {
    $schema: StoreWritable<RepeaterComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchemaEvent: EventCallable<SetSchemaPayload>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type UploaderModel = {
    $schema: StoreWritable<UploaderComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchemaEvent: EventCallable<SetSchemaPayload>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type StaticModel = {
    $schema: StoreWritable<StaticComponentSchema>
    setSchemaEvent: EventCallable<SetSchemaPayload>
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
