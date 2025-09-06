import { TypeCheckingError, Unwrap } from '@form-crafter/utils'

import { ComponentSchema, ComponentSerializableValue, EditableComponentSchema } from '../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../options-builder'
import { RuleExecutorContext } from '../rules'

type GeneralConditionOperator = {
    key: string
    displayName: string
    helpText?: string
}

export type EnterValueConditionOperator = {
    available: boolean
    required?: boolean
}

export type ConditionOperatorExecute<OptsBuilder, EnterValue, OptsBuilderOptions, CompSchema extends EditableComponentSchema> = unknown extends OptsBuilder
    ? unknown extends EnterValue
        ? (
              schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
              params: {
                  ctx: RuleExecutorContext
              },
          ) => boolean
        : EnterValue extends { available: true }
          ? { available: true } extends EnterValue
              ? (
                    schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                    params: {
                        ctx: RuleExecutorContext
                        enteredComponentValue: Unwrap<NonNullable<ComponentSerializableValue>>
                    },
                ) => boolean
              : EnterValue extends { required: true }
                ? (
                      schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                      params: {
                          ctx: RuleExecutorContext
                          enteredComponentValue: Unwrap<NonNullable<ComponentSerializableValue>>
                      },
                  ) => boolean
                : (
                      schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                      params: {
                          ctx: RuleExecutorContext
                          enteredComponentValue?: ComponentSerializableValue
                      },
                  ) => boolean
          : (
                schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                params: {
                    ctx: RuleExecutorContext
                },
            ) => boolean
    : unknown extends EnterValue
      ? (
            schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
            params: {
                ctx: RuleExecutorContext
                options: OptsBuilderOptions
            },
        ) => boolean
      : EnterValue extends { available: true }
        ? { available: true } extends EnterValue
            ? (
                  schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                  params: {
                      ctx: RuleExecutorContext
                      options: OptsBuilderOptions
                      enteredComponentValue: Unwrap<NonNullable<ComponentSerializableValue>>
                  },
              ) => boolean
            : EnterValue extends { required: true }
              ? (
                    schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                    params: {
                        ctx: RuleExecutorContext
                        options: OptsBuilderOptions
                        enteredComponentValue: Unwrap<NonNullable<ComponentSerializableValue>>
                    },
                ) => boolean
              : (
                    schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
                    params: {
                        ctx: RuleExecutorContext
                        options: OptsBuilderOptions
                        enteredComponentValue?: ComponentSerializableValue
                    },
                ) => boolean
        : (
              schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
              params: {
                  ctx: RuleExecutorContext
                  options: OptsBuilderOptions
              },
          ) => boolean

export type ComponentConditionOperatorToCreate<OptsBuilder, EnterValue, Execute> = unknown extends OptsBuilder
    ? unknown extends EnterValue
        ? GeneralConditionOperator & {
              execute: Execute
              enterComponentValue?: never
              optionsBuilder?: never
          } // ' - | - '
        : EnterValue extends EnterValueConditionOperator
          ? GeneralConditionOperator & {
                execute: Execute
                enterComponentValue: EnterValue
                optionsBuilder?: never
            } // ' enterComponentValue | - '
          : TypeCheckingError<'incorrent enterComponentValue type', EnterValue, Unwrap<EnterValueConditionOperator>>
    : OptsBuilder extends GroupOptionsBuilder
      ? unknown extends EnterValue
          ? GeneralConditionOperator & {
                execute: Execute
                enterComponentValue?: never
                optionsBuilder: OptsBuilder
            } // ' - | optionsBuilder '
          : EnterValue extends EnterValueConditionOperator
            ? GeneralConditionOperator & {
                  execute: Execute
                  enterComponentValue: EnterValue
                  optionsBuilder: OptsBuilder
              } // ' enterComponentValue | optionsBuilder '
            : TypeCheckingError<'incorrent enterComponentValue type', EnterValue, Unwrap<EnterValueConditionOperator>>
      : TypeCheckingError<'optionsBuilder should be a group builder', OptsBuilder>

export type ComponentConditionOperator<
    CompSchema extends ComponentSchema = ComponentSchema,
    OptsBuilder extends GroupOptionsBuilder = GroupOptionsBuilder,
> = GeneralConditionOperator & {
    execute: (
        schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
        params: {
            ctx: RuleExecutorContext
            options?: OptionsBuilderOutput<GroupOptionsBuilder>
            enteredComponentValue?: Unwrap<NonNullable<ComponentSerializableValue>>
        },
    ) => boolean
    enterComponentValue?: EnterValueConditionOperator
    optionsBuilder?: OptsBuilder
}
