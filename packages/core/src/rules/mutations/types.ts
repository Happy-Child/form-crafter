import { AvailableObject, TypeCheckingError, Unwrap } from '@form-crafter/utils'

import { ComponentSchema, MutationRollbackStrategy } from '../../components'
import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { GeneralRuleConfig, RuleExecutorContext } from '../types'

export type MutationRuleExecute<OptsBuilderOptions, CompSchema extends ComponentSchema> = unknown extends OptsBuilderOptions
    ? (
          schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
          params: {
              ctx: RuleExecutorContext
          },
      ) => AvailableObject | null
    : (
          schema: Unwrap<Pick<CompSchema, 'meta' | 'properties'>>,
          params: {
              ctx: RuleExecutorContext
              options: OptsBuilderOptions
          },
      ) => AvailableObject | null

export type MutationRollbackStrategies<Execute> = Record<
    string,
    GeneralRuleConfig & {
        toRollback: Execute
    }
>

export type MutationRollback<S> = {
    default: MutationRollbackStrategy
    additionalStrategies?: S
}

export type MutationRuleToCreate<OptsBuilder, Execute, RollbackStrategies> = unknown extends OptsBuilder
    ? GeneralRuleConfig & {
          execute: Execute
          optionsBuilder?: never
          rollback?: MutationRollback<RollbackStrategies>
      }
    : OptsBuilder extends GroupOptionsBuilder
      ? GeneralRuleConfig & {
            execute: Execute
            optionsBuilder: OptsBuilder
            rollback?: MutationRollback<RollbackStrategies>
        }
      : TypeCheckingError<'optionsBuilder should be a group builder', OptsBuilder>

export type MutationRule<OptsBuilder extends GroupOptionsBuilder = GroupOptionsBuilder> =
    | (GeneralRuleConfig & {
          rollback?: MutationRollback<MutationRollbackStrategies<MutationRuleExecute<OptionsBuilderOutput<OptsBuilder>, ComponentSchema>>>
          execute: (
              schema: Unwrap<Pick<ComponentSchema, 'meta' | 'properties'>>,
              params: {
                  ctx: RuleExecutorContext
                  options: OptionsBuilderOutput<GroupOptionsBuilder>
              },
          ) => AvailableObject | null
          optionsBuilder: OptsBuilder
      })
    | (GeneralRuleConfig & {
          rollback?: MutationRollback<MutationRollbackStrategies<MutationRuleExecute<unknown, ComponentSchema>>>
          execute: (
              schema: Unwrap<Pick<ComponentSchema, 'meta' | 'properties'>>,
              params: {
                  ctx: RuleExecutorContext
              },
          ) => AvailableObject | null
      })

export type MutationRuleWithOptionsBuilder = Extract<MutationRule, { optionsBuilder: GroupOptionsBuilder }>
