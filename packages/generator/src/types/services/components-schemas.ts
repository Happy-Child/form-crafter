import {
    ComponentType,
    ContainerComponentProperties,
    ContainerComponentSchema,
    EditableComponentProperties,
    EditableComponentSchema,
    EntityId,
    RepeaterComponentSchema,
    StaticComponentSchema,
    UploaderComponentProperties,
    UploaderComponentSchema,
    ValidationRuleComponentError,
} from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { EventCallable, Store, StoreWritable } from 'effector'

export type EditableSchemaModel = {
    $schema: StoreWritable<EditableComponentSchema>
    $error: StoreWritable<ValidationRuleComponentError | null>
    $isRequired: Store<boolean>
    setModelEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
    onSetPropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
    onBlurEvent: EventCallable<void>
    runValidationEvent: EventCallable<void>
}

export type ContainerSchemaModel = {
    $schema: StoreWritable<ContainerComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export type RepeaterSchemaModel = {
    $schema: StoreWritable<RepeaterComponentSchema>
    $error: StoreWritable<ValidationRuleComponentError | null>
    $isRequired: StoreWritable<boolean>
    setModelEvent: EventCallable<OptionalSerializableObject>
    runValidationEvent: EventCallable<void>
}

export type UploaderSchemaModel = {
    $schema: StoreWritable<UploaderComponentSchema>
    $error: StoreWritable<ValidationRuleComponentError | null>
    $isRequired: StoreWritable<boolean>
    setModelEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
    runValidationEvent: EventCallable<void>
}

export type StaticSchemaModel = {
    $schema: StoreWritable<StaticComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
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

export type SchemaMap = Map<EntityId, ComponentSchemaModel>
