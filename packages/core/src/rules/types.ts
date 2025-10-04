import { AvailableObject } from '@form-crafter/utils'

import { ComponentSchema } from '../components'
import { OptionsBuilder, OptionsBuilderOutput } from '../options-builder'
import { EntityId } from '../types'

export type GeneralRuleConfig = {
    key: string
    displayName: string
    helpText?: string
}

export type RuleExecutorContext = {
    getComponentSchemaById: (componentId: EntityId) => ComponentSchema | null
    getCurrentView: () => string | null
    getRepeaterChildIds: (componentId: EntityId) => EntityId[]
    isTemplateComponentId: (componentId: EntityId) => boolean | null
}

export type RuleExecuteParams<B extends OptionsBuilder<AvailableObject>> =
    B extends OptionsBuilder<any>
        ? {
              ctx: RuleExecutorContext
              options: OptionsBuilderOutput<B>
          }
        : {
              ctx: RuleExecutorContext
          }

export type RuleExecuteData<S extends ComponentSchema> = {
    schema: S
}
