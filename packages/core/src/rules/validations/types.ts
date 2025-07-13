import { OptionalSerializableValue, SerializableObject } from '@form-crafter/utils'

import { ComponentsSchemas, ValidationRuleComponentError } from '../../components'
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

export type ValidationRuleComponentResult =
    | {
          isValid: false
          error: ValidationRuleComponentError
      }
    | {
          isValid: true
      }

export type ValidationRuleFormReturn = Record<EntityId, ValidationRuleComponentResult>

export type EditableValidationRule<
    V extends OptionalSerializableValue,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
> = GeneralValidationRule & {
    type: 'editable'
    optionsBuilder: O
    validate: (value: V, params: RuleExecuteParams<O>) => ValidationRuleComponentResult
}
export type EditableValidationRuleWithoutOptions<V extends OptionalSerializableValue> = GeneralValidationRule & {
    type: 'editable'
    validate: (value: V, params: RuleExecuteParamsWithoutOptions) => ValidationRuleComponentResult
}

export type RepeaterValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    type: 'repeater'
    optionsBuilder: O
    validate: (componentId: EntityId, params: RuleExecuteParams<O>) => ValidationRuleComponentResult
}
export type RepeaterValidationRuleWithoutOptions = GeneralValidationRule & {
    type: 'repeater'
    validate: (componentId: EntityId, params: RuleExecuteParamsWithoutOptions) => ValidationRuleComponentResult
}

// TODO fix generic type
export type UploaderValidationRule<
    V extends OptionalSerializableValue,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
> = GeneralValidationRule & {
    type: 'uploader'
    optionsBuilder: O
    validate: (value: V, params: RuleExecuteParams<O>) => ValidationRuleComponentResult
}
export type UploaderValidationRuleWithoutOptions<V extends OptionalSerializableValue> = GeneralValidationRule & {
    type: 'uploader'
    validate: (value: V, params: RuleExecuteParamsWithoutOptions) => ValidationRuleComponentResult
}

export type ComponentValidationRule<T extends OptionalSerializableValue = OptionalSerializableValue> =
    | EditableValidationRule<T>
    | RepeaterValidationRule
    | UploaderValidationRule<T>

export type FormValidationRule<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>> = GeneralValidationRule & {
    optionsBuilder: O
    validate: (componentsSchemas: ComponentsSchemas, params: RuleExecuteParams<O>) => ValidationRuleFormReturn
}
export type FormValidationRuleWithoutOptions = GeneralValidationRule & {
    validate: (componentsSchemas: ComponentsSchemas, params: RuleExecuteParamsWithoutOptions) => ValidationRuleFormReturn
}
