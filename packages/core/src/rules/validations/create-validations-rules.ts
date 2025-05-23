import { OptionalSerializableValue, SerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../../options-builder'
import {
    ContainerValidationRule,
    ContainerValidationRuleWithoutOptions,
    EditableValidationRule,
    EditableValidationRuleWithoutOptions,
    FormValidationRule,
    FormValidationRuleWithoutOptions,
    RepeaterValidationRule,
    RepeaterValidationRuleWithoutOptions,
    UploaderValidationRule,
    UploaderValidationRuleWithoutOptions,
} from './types'

export function createEditableValidationRule<V extends OptionalSerializableValue>(
    params: EditableValidationRuleWithoutOptions<V>,
): EditableValidationRuleWithoutOptions<V>
export function createEditableValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: EditableValidationRule<V, O>,
): EditableValidationRule<V, O>
export function createEditableValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: EditableValidationRule<V, O> | EditableValidationRuleWithoutOptions<V>,
): EditableValidationRule<V, O> | EditableValidationRuleWithoutOptions<V> {
    return params
}

export function createContainerValidationRule(params: ContainerValidationRuleWithoutOptions): ContainerValidationRuleWithoutOptions
export function createContainerValidationRule<O extends OptionsBuilder<SerializableObject>>(params: ContainerValidationRule<O>): ContainerValidationRule<O>
export function createContainerValidationRule<O extends OptionsBuilder<SerializableObject>>(
    params: ContainerValidationRule<O> | ContainerValidationRuleWithoutOptions,
): ContainerValidationRule<O> | ContainerValidationRuleWithoutOptions {
    return params
}

export function createRepeaterValidationRule(params: RepeaterValidationRuleWithoutOptions): RepeaterValidationRuleWithoutOptions
export function createRepeaterValidationRule<O extends OptionsBuilder<SerializableObject>>(params: RepeaterValidationRule<O>): RepeaterValidationRule<O>
export function createRepeaterValidationRule<O extends OptionsBuilder<SerializableObject>>(
    params: RepeaterValidationRule<O> | RepeaterValidationRuleWithoutOptions,
): RepeaterValidationRule<O> | RepeaterValidationRuleWithoutOptions {
    return params
}

export function createUploaderValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: UploaderValidationRule<V, O>,
): UploaderValidationRule<V, O>
export function createUploaderValidationRule<V extends OptionalSerializableValue>(
    params: UploaderValidationRuleWithoutOptions<V>,
): UploaderValidationRuleWithoutOptions<V>
export function createUploaderValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: UploaderValidationRule<V, O> | UploaderValidationRuleWithoutOptions<V>,
): UploaderValidationRule<V, O> | UploaderValidationRuleWithoutOptions<V> {
    return params
}

export function createFormValidationRule<O extends OptionsBuilder<SerializableObject>>(params: FormValidationRule<O>): FormValidationRule<O>
export function createFormValidationRule(params: FormValidationRuleWithoutOptions): FormValidationRuleWithoutOptions
export function createFormValidationRule<O extends OptionsBuilder<SerializableObject>>(
    params: FormValidationRule<O> | FormValidationRuleWithoutOptions,
): FormValidationRule<O> | FormValidationRuleWithoutOptions {
    return params
}
