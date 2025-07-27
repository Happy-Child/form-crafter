import { OptionalSerializableValue, SerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../../options-builder'
import {
    EditableValidationRule,
    EditableValidationRuleWithoutOptions,
    GroupValidationRule,
    GroupValidationRuleWithoutOptions,
    RepeaterValidationRule,
    RepeaterValidationRuleWithoutOptions,
    UploaderValidationRule,
    UploaderValidationRuleWithoutOptions,
} from './types'

export function createEditableValidationRule<V extends OptionalSerializableValue>(
    params: Omit<EditableValidationRuleWithoutOptions<V>, 'type'>,
): EditableValidationRuleWithoutOptions<V>
export function createEditableValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: Omit<EditableValidationRule<V, O>, 'type'>,
): EditableValidationRule<V, O>
export function createEditableValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: Omit<EditableValidationRule<V, O>, 'type'> | Omit<EditableValidationRuleWithoutOptions<V>, 'type'>,
): EditableValidationRule<V, O> | EditableValidationRuleWithoutOptions<V> {
    return { ...params, type: 'editable' }
}

export function createRepeaterValidationRule(params: Omit<RepeaterValidationRuleWithoutOptions, 'type'>): RepeaterValidationRuleWithoutOptions
export function createRepeaterValidationRule<O extends OptionsBuilder<SerializableObject>>(
    params: Omit<RepeaterValidationRule<O>, 'type'>,
): RepeaterValidationRule<O>
export function createRepeaterValidationRule<O extends OptionsBuilder<SerializableObject>>(
    params: Omit<RepeaterValidationRule<O>, 'type'> | Omit<RepeaterValidationRuleWithoutOptions, 'type'>,
): RepeaterValidationRule<O> | RepeaterValidationRuleWithoutOptions {
    return { ...params, type: 'repeater' }
}

export function createUploaderValidationRule<V extends OptionalSerializableValue>(
    params: Omit<UploaderValidationRuleWithoutOptions<V>, 'type'>,
): UploaderValidationRuleWithoutOptions<V>
export function createUploaderValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: Omit<UploaderValidationRule<V, O>, 'type'>,
): UploaderValidationRule<V, O>
export function createUploaderValidationRule<V extends OptionalSerializableValue, O extends OptionsBuilder<SerializableObject>>(
    params: Omit<UploaderValidationRule<V, O>, 'type'> | Omit<UploaderValidationRuleWithoutOptions<V>, 'type'>,
): UploaderValidationRule<V, O> | UploaderValidationRuleWithoutOptions<V> {
    return { ...params, type: 'uploader' }
}

export function createGroupValidationRule<O extends OptionsBuilder<SerializableObject>>(params: Omit<GroupValidationRule<O>, 'type'>): GroupValidationRule<O>
export function createGroupValidationRule(params: Omit<GroupValidationRuleWithoutOptions, 'type'>): GroupValidationRuleWithoutOptions
export function createGroupValidationRule<O extends OptionsBuilder<SerializableObject>>(
    params: Omit<GroupValidationRule<O>, 'type'> | Omit<GroupValidationRuleWithoutOptions, 'type'>,
): GroupValidationRule<O> | GroupValidationRuleWithoutOptions {
    return { ...params, type: 'group' }
}
