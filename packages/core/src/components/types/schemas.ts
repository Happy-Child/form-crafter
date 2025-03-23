import { OptionalSerializableObject } from '@form-crafter/utils'

import { ValidationRuleParams } from '../../rules'
import { ComponentType, EntityId } from '../../types'
import { ViewsDefinitions } from '../../views'

export type ValidationsConfigs = {
    disableSelf?: boolean
    disableChildren?: boolean
}

export type ComponentValidations = {
    configs: ValidationsConfigs
    params: ValidationRuleParams[]
}

export type ComponentRelations = {
    params: any[]
}

export type GeneralComponentSchema = {
    // TODO impl it
    hidden?: boolean
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

export type EditableComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponentSchema & {
    meta: ComponentMeta<'editable'>
    properties: T
}

export type ContainerComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponentSchema & {
    meta: ComponentMeta<'container'>
    properties: T
}

export type RepeaterComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponentSchema & {
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

export type UploaderComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponentSchema & {
    meta: ComponentMeta<'uploader'>
    properties: T
}

export type StaticComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponentSchema & {
    meta: ComponentMeta<'static'>
    properties: T
}

export type ComponentSchema = EditableComponentSchema | ContainerComponentSchema | RepeaterComponentSchema | UploaderComponentSchema | StaticComponentSchema

export type TemplateComponentSchema<Schema extends ComponentSchema> = Omit<Schema, 'meta'> & {
    meta: Omit<Schema['meta'], 'id' | 'templateId'> & {
        templateId: EntityId
    }
}

export type ComponentsPropertiesData = Record<EntityId, Partial<ComponentSchema['properties']>>

export type ComponentsSchemas = Record<EntityId, ComponentSchema>
