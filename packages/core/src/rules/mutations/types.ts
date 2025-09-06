import { TypeCheckingError, Unwrap } from '@form-crafter/utils'

import { ComponentSchema } from '../../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { GeneralRuleConfig, RuleExecutorContext } from '../types'

export type MutationRuleExecute<OptsBuilderOptions, CompSchema extends ComponentSchema> = unknown extends OptsBuilderOptions
    ? (
          schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
          params: {
              ctx: RuleExecutorContext
          },
      ) => Partial<CompSchema['properties']> | null
    : (
          schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
          params: {
              ctx: RuleExecutorContext
              options: OptsBuilderOptions
          },
      ) => Partial<CompSchema['properties']> | null

export type MutationRuleToCreate<OptsBuilder, Execute> = unknown extends OptsBuilder
    ? GeneralRuleConfig & {
          execute: Execute
          optionsBuilder?: never
      }
    : OptsBuilder extends GroupOptionsBuilder
      ? GeneralRuleConfig & {
            execute: Execute
            optionsBuilder: OptsBuilder
        }
      : TypeCheckingError<'optionsBuilder should be a group builder', OptsBuilder>

export type MutationRule<CompSchema extends ComponentSchema = ComponentSchema, OptsBuilder extends GroupOptionsBuilder = GroupOptionsBuilder> =
    | (GeneralRuleConfig & {
          execute: (
              schema: Unwrap<Pick<ComponentSchema, 'meta' | 'properties'>>,
              params: {
                  ctx: RuleExecutorContext
                  options: OptionsBuilderOutput<GroupOptionsBuilder>
              },
          ) => Partial<CompSchema['properties']> | null
          optionsBuilder: OptsBuilder
      })
    | (GeneralRuleConfig & {
          execute: (
              schema: Unwrap<Pick<ComponentSchema, 'meta' | 'properties'>>,
              params: {
                  ctx: RuleExecutorContext
              },
          ) => Partial<CompSchema['properties']> | null
      })

export type MutationRuleWithOptionsBuilder = Extract<MutationRule, { optionsBuilder: GroupOptionsBuilder }>
