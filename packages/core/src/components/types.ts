import { FC } from 'react'

import { AvailableObject } from '@form-crafter/utils'

import { ComponentConditionOperator } from '../components-operators'
import { ComponentValidationRule, MutationRule } from '../rules'
import { EntityId } from '../types'
import { ComponentMeta } from './schema'
import {
    ContainerComponent,
    ContainerComponentModule,
    ContainerComponentProperties,
    ContainerComponentSchema,
    DateInputComponent,
    DateInputComponentModule,
    DateInputComponentProperties,
    DatePickerComponent,
    DatePickerComponentModule,
    DatePickerComponentProperties,
    DateRangeComponent,
    DateRangeComponentModule,
    DateRangeComponentProperties,
    EditableComponentSchema,
    MultipleSelectComponent,
    MultipleSelectComponentModule,
    MultipleSelectComponentProperties,
    NumberInputComponent,
    NumberInputComponentModule,
    NumberInputComponentProperties,
    RepeaterComponent,
    RepeaterComponentModule,
    RepeaterComponentProperties,
    RepeaterComponentSchema,
    SelectComponent,
    SelectComponentModule,
    SelectComponentProperties,
    StaticComponent,
    StaticComponentModule,
    StaticComponentProperties,
    StaticComponentSchema,
    TextInputComponent,
    TextInputComponentModule,
    TextInputComponentProperties,
    UploaderComponentModule,
    UploaderComponentProperties,
    UploaderComponentSchema,
} from './variants'

export type ComponentType =
    | 'text-input'
    | 'number-input'
    | 'date-input'
    | 'multiple-select'
    | 'select'
    | 'date-picker'
    | 'date-range'
    | 'uploader'
    | 'container'
    | 'repeater'
    | 'static'

export type EditableComponentType =
    | Extract<ComponentType, 'text-input' | 'number-input' | 'date-input' | 'multiple-select' | 'select' | 'date-picker' | 'date-range' | 'uploader'>
    | 'static'

export type GeneratorComponentType = 'editable' | 'container' | 'repeater' | 'static'

export type ComponentSchema = EditableComponentSchema | ContainerComponentSchema | RepeaterComponentSchema | StaticComponentSchema

export type ComponentPropertiesMap = {
    'text-input': TextInputComponentProperties
    'number-input': NumberInputComponentProperties
    'date-input': DateInputComponentProperties
    'multiple-select': MultipleSelectComponentProperties
    select: SelectComponentProperties
    'date-picker': DatePickerComponentProperties
    'date-range': DateRangeComponentProperties
    uploader: UploaderComponentProperties
    container: ContainerComponentProperties
    repeater: RepeaterComponentProperties
    static: StaticComponentProperties
}

export type ComponentProperties<T extends keyof ComponentPropertiesMap> = ComponentPropertiesMap[T]

export type GeneratorEditableComponentProperties =
    | ComponentProperties<'text-input'>
    | ComponentProperties<'number-input'>
    | ComponentProperties<'date-input'>
    | ComponentProperties<'multiple-select'>
    | ComponentProperties<'select'>
    | ComponentProperties<'date-picker'>
    | ComponentProperties<'date-range'>

export type GeneratorComponentPropertiesMap = {
    editable: GeneratorEditableComponentProperties
    container: ComponentProperties<'container'>
    repeater: ComponentProperties<'repeater'>
    static: ComponentProperties<'static'>
}

export type GeneratorComponentProperties<T extends keyof GeneratorComponentPropertiesMap> = GeneratorComponentPropertiesMap[T]

type GeneratorEditableComponent =
    | TextInputComponent
    | NumberInputComponent
    | DateInputComponent
    | MultipleSelectComponent
    | SelectComponent
    | DatePickerComponent
    | DateRangeComponent

type GeneratorComponentMap = {
    editable: GeneratorEditableComponent
    container: ContainerComponent<AvailableObject>
    repeater: RepeaterComponent<AvailableObject>
    static: StaticComponent<AvailableObject>
}

type RenderGeneratorComponentProps<T extends keyof GeneratorComponentMap> = Omit<Parameters<GeneratorComponentMap[T]>[0], 'meta' | 'properties'> & {
    meta: ComponentMeta<ComponentType>
    properties: AvailableObject
}

export type RenderGeneratorComponent<T extends keyof GeneratorComponentMap> = FC<RenderGeneratorComponentProps<T>>

export type GeneratorComponentSchemaMap = {
    editable: EditableComponentSchema
    container: ContainerComponentSchema
    repeater: RepeaterComponentSchema
    uploader: UploaderComponentSchema
    static: StaticComponentSchema
}

export type GeneratorComponentSchemaByType<T extends keyof GeneratorComponentSchemaMap> = GeneratorComponentSchemaMap[T]

export type TemplateComponentSchema<Schema extends ComponentSchema = ComponentSchema> = Omit<Schema, 'meta'> & {
    meta: Omit<Schema['meta'], 'id' | 'templateId'> & {
        templateId: EntityId
    }
}

export type ComponentsPropertiesData = Record<EntityId, Partial<ComponentSchema['properties']>>

export type ComponentsSchemas = Record<EntityId, ComponentSchema>

export type ComponentModule =
    | DateInputComponentModule
    | DatePickerComponentModule
    | DateRangeComponentModule
    | MultipleSelectComponentModule
    | NumberInputComponentModule
    | SelectComponentModule
    | TextInputComponentModule
    | UploaderComponentModule
    | ContainerComponentModule
    | RepeaterComponentModule
    | StaticComponentModule

export type ComponentModuleWithMutations = Exclude<ComponentModule, ContainerComponentModule> & { mutations: MutationRule[] }

export type ComponentModuleWithValidations = Exclude<ComponentModule, ContainerComponentModule | StaticComponentModule> & {
    validations: ComponentValidationRule[]
}

export type ComponentModuleWithOperators = Exclude<ComponentModule, ContainerComponentModule | RepeaterComponentModule | StaticComponentModule> & {
    operators: ComponentConditionOperator[]
}

export type ComponentSerializableValue = Exclude<ComponentSchema['properties']['value'], File | FileList>
