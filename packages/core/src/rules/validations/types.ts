import { TypeCheckingError, Unwrap } from '@form-crafter/utils'

import { ComponentSchema } from '../../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { EntityId } from '../../types'
import { GeneralRuleConfig, RuleExecutorContext } from '../types'

export type ValidateSchema<T extends ComponentSchema> = Unwrap<Pick<T, 'meta' | 'properties'>>

export type ComponentValidationResult =
    | {
          isValid: false
          message: string
      }
    | {
          isValid: true
      }
    | null

export type ComponentValidationRuleValidate<OptsBuilderOptions, CompSchema extends ComponentSchema> = unknown extends OptsBuilderOptions
    ? (
          schema: CompSchema,
          params: {
              ctx: RuleExecutorContext
          },
      ) => ComponentValidationResult
    : (
          schema: CompSchema,
          params: {
              ctx: RuleExecutorContext
              options: OptsBuilderOptions
          },
      ) => ComponentValidationResult

export type ComponentValidationRuleToCreate<OptsBuilder, Validate> = unknown extends OptsBuilder
    ? GeneralRuleConfig & {
          validate: Validate
          optionsBuilder?: never
      }
    : OptsBuilder extends GroupOptionsBuilder
      ? GeneralRuleConfig & {
            validate: Validate
            optionsBuilder: OptsBuilder
        }
      : TypeCheckingError<'optionsBuilder should be a group builder', OptsBuilder>

export type ComponentValidationRule<OptsBuilder extends GroupOptionsBuilder = GroupOptionsBuilder> =
    | (GeneralRuleConfig & {
          type: 'component'
          validate: (
              schema: ValidateSchema<ComponentSchema>,
              params: {
                  ctx: RuleExecutorContext
                  options: OptionsBuilderOutput<GroupOptionsBuilder>
              },
          ) => ComponentValidationResult
          optionsBuilder: OptsBuilder
      })
    | (GeneralRuleConfig & {
          type: 'component'
          validate: (
              schema: ValidateSchema<ComponentSchema>,
              params: {
                  ctx: RuleExecutorContext
              },
          ) => ComponentValidationResult
      })

export type ComponentValidationRuleWithOptionsBuilder = Extract<ComponentValidationRule, { optionsBuilder: GroupOptionsBuilder }>

export type GroupValidationResult =
    | {
          isValid: false
          message?: string
          componentsErrors?: { componentId: EntityId; message: string }[]
      }
    | {
          isValid: true
      }
    | null

export type GeneralGroupValidationRuleConfig = GeneralRuleConfig & {
    type: 'group'
}

export type GroupValidationRuleValidate<OptsBuilderOptions> = unknown extends OptsBuilderOptions
    ? (params: { ctx: RuleExecutorContext }) => GroupValidationResult
    : (params: { ctx: RuleExecutorContext; options: OptsBuilderOptions }) => GroupValidationResult

export type GroupValidationRuleToCreate<OptsBuilder, Validate> = unknown extends OptsBuilder
    ? GeneralRuleConfig & {
          validate: Validate
          optionsBuilder?: never
      }
    : OptsBuilder extends GroupOptionsBuilder
      ? GeneralRuleConfig & {
            validate: Validate
            optionsBuilder: OptsBuilder
        }
      : TypeCheckingError<'optionsBuilder should be a group builder', OptsBuilder>

export type GroupValidationRule<OptsBuilder extends GroupOptionsBuilder = GroupOptionsBuilder> =
    | (GeneralRuleConfig & {
          type: 'group'
          validate: (params: { ctx: RuleExecutorContext; options: OptionsBuilderOutput<GroupOptionsBuilder> }) => GroupValidationResult
          optionsBuilder: OptsBuilder
      })
    | (GeneralRuleConfig & {
          type: 'group'
          validate: (params: { ctx: RuleExecutorContext }) => GroupValidationResult
      })
