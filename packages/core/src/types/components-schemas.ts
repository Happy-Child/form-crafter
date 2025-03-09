import { OptionalSerializableObject } from '@form-crafter/utils'

import { ComponentType, EntityId } from './general'
import { ValidationRuleSchema } from './validation-schema'
import { ViewsDefinitions } from './views'

export type ValidationsParams = {
    disableSelf?: boolean
    disableChildren?: boolean
}

export type RelationsParams = {
    disableSelf?: boolean
    disableChildren?: boolean
}

export type GeneralComponent = {
    hidden?: boolean
    validation?: {
        params: ValidationsParams
        rules: ValidationRuleSchema[]
    }
    relations?: {
        params: RelationsParams
        rules: any[]
    }
}

export type ComponentMeta<T extends ComponentType> = {
    id: EntityId
    templateId?: EntityId
    type: T
    name: string
    formKey?: string
}

export type EditableComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
    meta: ComponentMeta<'editable'>
    properties: T
}

export type ContainerComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
    meta: ComponentMeta<'container'>
    properties: T
}

export type RepeaterComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
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

export type UploaderComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
    meta: ComponentMeta<'uploader'>
    properties: T
}

export type StaticComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
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
