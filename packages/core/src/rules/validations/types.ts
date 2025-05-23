import { OptionalSerializableValue, SerializableObject } from '@form-crafter/utils'

import { ConditionNode } from '../../conditions'
import { OptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { EntityId } from '../../types'
import { RuleExecuteParams, RuleExecuteParamsWithoutOptions } from '../types'

export type ValidationRuleUserOptions = {
    id: EntityId
    ruleName: string
    options?: OptionsBuilderOutput<OptionsBuilder<SerializableObject>>
    condition?: ConditionNode
}

type GeneralValidationRule = {
    ruleName: string
    displayName: string
}

export type ValidationRuleFormParams<O extends OptionsBuilder<SerializableObject>> = {
    options: OptionsBuilderOutput<O>
}
export type ValidationRuleFormParamsWithoutOptions = {}

export type EditableValidationRule<
    V extends OptionalSerializableValue,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
> = GeneralValidationRule & {
    optionsBuilder: O
    validate: (value: V, params: RuleExecuteParams<O>) => any
}
export type EditableValidationRuleWithoutOptions<V extends OptionalSerializableValue> = GeneralValidationRule & {
    validate: (value: V, params: RuleExecuteParamsWithoutOptions) => any
}

export type ContainerValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    optionsBuilder: O
    validate: (componentId: EntityId, params: RuleExecuteParams<O>) => any
}
export type ContainerValidationRuleWithoutOptions = GeneralValidationRule & {
    validate: (componentId: EntityId, params: RuleExecuteParamsWithoutOptions) => any
}

export type RepeaterValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    optionsBuilder: O
    validate: (componentId: EntityId, params: RuleExecuteParams<O>) => any
}
export type RepeaterValidationRuleWithoutOptions = GeneralValidationRule & {
    validate: (componentId: EntityId, params: RuleExecuteParamsWithoutOptions) => any
}

// TODO fix generic type
export type UploaderValidationRule<V, O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    optionsBuilder: O
    validate: (value: V, params: RuleExecuteParams<O>) => any
}
export type UploaderValidationRuleWithoutOptions<V> = GeneralValidationRule & {
    validate: (value: V, params: RuleExecuteParamsWithoutOptions) => any
}

export type FormValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    optionsBuilder: O
    validate: (params: ValidationRuleFormParams<O>) => any
}
export type FormValidationRuleWithoutOptions = GeneralValidationRule & {
    validate: (params: ValidationRuleFormParamsWithoutOptions) => any
}
