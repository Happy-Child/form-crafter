import { OptionalSerializableValue, SerializableObject } from '@form-crafter/utils'

import { OptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { EntityId } from '../../types'
import { RuleExecuteParams, RuleExecuteParamsWithoutOptions } from '../types'

type GeneralValidationRule = {
    ruleName: string
    displayName: string
}

export type ValidationRuleFormParams<O extends OptionsBuilder<SerializableObject>> = {
    options: OptionsBuilderOutput<O>
}

export type ComponentValidationResult =
    | {
          isValid: false
          message: string
      }
    | {
          isValid: true
      }

export type GroupValidationResult =
    | {
          isValid: false
          message?: string
          componentsErrors?: { componentId: EntityId; message: string }[]
      }
    | {
          isValid: true
      }

export type EditableValidationRule<
    V extends OptionalSerializableValue,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
> = GeneralValidationRule & {
    type: 'editable'
    optionsBuilder: O
    validate: (value: V, params: RuleExecuteParams<O>) => ComponentValidationResult
}
export type EditableValidationRuleWithoutOptions<V extends OptionalSerializableValue> = GeneralValidationRule & {
    type: 'editable'
    validate: (value: V, params: RuleExecuteParamsWithoutOptions) => ComponentValidationResult
}

export type RepeaterValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    type: 'repeater'
    optionsBuilder: O
    validate: (componentId: EntityId, params: RuleExecuteParams<O>) => ComponentValidationResult
}
export type RepeaterValidationRuleWithoutOptions = GeneralValidationRule & {
    type: 'repeater'
    validate: (componentId: EntityId, params: RuleExecuteParamsWithoutOptions) => ComponentValidationResult
}

// TODO fix generic type
export type UploaderValidationRule<
    V extends OptionalSerializableValue,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
> = GeneralValidationRule & {
    type: 'uploader'
    optionsBuilder: O
    validate: (value: V, params: RuleExecuteParams<O>) => ComponentValidationResult
}
export type UploaderValidationRuleWithoutOptions<V extends OptionalSerializableValue> = GeneralValidationRule & {
    type: 'uploader'
    validate: (value: V, params: RuleExecuteParamsWithoutOptions) => ComponentValidationResult
}

export type ComponentValidationRule<T extends OptionalSerializableValue = OptionalSerializableValue> =
    | EditableValidationRule<T>
    | RepeaterValidationRule
    | UploaderValidationRule<T>

export type GroupValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    type: 'group'
    optionsBuilder: O
    validate: (params: RuleExecuteParams<O>) => GroupValidationResult
}
export type GroupValidationRuleWithoutOptions = GeneralValidationRule & {
    type: 'group'
    validate: (params: RuleExecuteParamsWithoutOptions) => GroupValidationResult
}
