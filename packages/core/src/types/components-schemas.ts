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

export type BaseComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
    meta: ComponentMeta<'base'>
    properties: T
}

export type ContainerComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
    meta: ComponentMeta<'container'>
    properties: T
}

export type DynamicContainerComponentSchema<T extends OptionalSerializableObject = OptionalSerializableObject> = GeneralComponent & {
    meta: ComponentMeta<'dynamic-container'>
    template: {
        views: ViewsDefinitions
        componentsSchemas: Record<EntityId, BaseComponentSchema | ContainerComponentSchema | DynamicContainerComponentSchema>
    }
    properties: T
}

export type ComponentSchema = BaseComponentSchema | ContainerComponentSchema | DynamicContainerComponentSchema

export type TemplateComponentSchema<Schema extends ComponentSchema> = Omit<Schema, 'meta'> & {
    meta: Omit<Schema['meta'], 'id' | 'templateId'> & {
        templateId: EntityId
    }
}

export type ComponentsPropertiesData = Record<EntityId, Partial<ComponentSchema['properties']>>

export type ComponentsMetaData = Record<EntityId, ComponentSchema['meta']>

export type ComponentsValidationData = Record<EntityId, NonNullable<ComponentSchema['validation']>>

export type ComponentsRelationsData = Record<EntityId, Required<ComponentSchema['relations']>>

export type ComponentSchemaValue = Extract<ComponentSchema, { properties: { value: unknown } }>['properties']['value']

export type ComponentsSchemas = Record<EntityId, ComponentSchema>
