import { RelationRuleUserOptions, ValidationRuleUserOptions } from '../../rules'
import { ComponentSchemaSettings, ComponentType, EntityId } from '../../types'
import {
    ContainerComponentProperties,
    EditableComponentProperties,
    RepeaterComponentProperties,
    StaticComponentProperties,
    UploaderComponentProperties,
} from '../../types'
import { ViewsDefinitions } from '../../views'

// TODO impl it
export type ValidationsConfigs = {
    disableSelf?: boolean
    disableChildren?: boolean
}

export type ComponentValidations = {
    configs: ValidationsConfigs
    options: ValidationRuleUserOptions[]
}

export type ComponentRelations = {
    options: RelationRuleUserOptions[]
}

export type GeneralComponentSchema = {
    settings?: ComponentSchemaSettings
    validations?: ComponentValidations
    relations?: ComponentRelations
}

export type ComponentMeta<T extends ComponentType> = {
    id: EntityId
    templateId?: EntityId
    type: T
    name: string
    formKey?: string
}

export type EditableComponentSchema<T extends EditableComponentProperties = EditableComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'editable'>
    properties: T
}

export type ContainerComponentSchema<T extends ContainerComponentProperties = ContainerComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'container'>
    properties: T
}

export type RepeaterComponentSchema<T extends RepeaterComponentProperties = RepeaterComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'repeater'>
    template: {
        views: ViewsDefinitions
        componentsSchemas: Record<
            EntityId,
            EditableComponentSchema | ContainerComponentSchema | RepeaterComponentSchema | UploaderComponentSchema | StaticComponentSchema
        >
    }
    properties: T
}

export type UploaderComponentSchema<T extends UploaderComponentProperties = UploaderComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'uploader'>
    properties: T
}

export type StaticComponentSchema<T extends StaticComponentProperties = StaticComponentProperties> = GeneralComponentSchema & {
    meta: ComponentMeta<'static'>
    properties: T
}

export type ComponentSchema = EditableComponentSchema | ContainerComponentSchema | RepeaterComponentSchema | UploaderComponentSchema | StaticComponentSchema

export type ComponentSchemaByType<T extends ComponentType> = T extends 'editable'
    ? EditableComponentSchema
    : T extends 'container'
      ? ContainerComponentSchema
      : T extends 'repeater'
        ? RepeaterComponentSchema
        : T extends 'uploader'
          ? UploaderComponentSchema
          : T extends 'static'
            ? StaticComponentSchema
            : never

export type TemplateComponentSchema<Schema extends ComponentSchema> = Omit<Schema, 'meta'> & {
    meta: Omit<Schema['meta'], 'id' | 'templateId'> & {
        templateId: EntityId
    }
}

export type ComponentsPropertiesData = Record<EntityId, Partial<ComponentSchema['properties']>>

export type ComponentsSchemas = Record<EntityId, ComponentSchema>
