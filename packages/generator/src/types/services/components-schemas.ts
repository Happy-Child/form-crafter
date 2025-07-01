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
} from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { EventCallable, StoreWritable } from 'effector'

export type EditableSchemaModel = {
    $model: StoreWritable<EditableComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
    onSetPropertiesEvent: EventCallable<Partial<EditableComponentProperties>>
}

export type ContainerSchemaModel = {
    $model: StoreWritable<ContainerComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<ContainerComponentProperties>>
}

export type RepeaterSchemaModel = {
    $model: StoreWritable<RepeaterComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
}

export type StaticSchemaModel = {
    $model: StoreWritable<StaticComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
}

export type UploaderSchemaModel = {
    $model: StoreWritable<UploaderComponentSchema>
    setModelEvent: EventCallable<OptionalSerializableObject>
    onUpdatePropertiesEvent: EventCallable<Partial<UploaderComponentProperties>>
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
