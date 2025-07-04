import { OptionalSerializableObject } from '@form-crafter/utils'

import { ComponentSchema } from '../components'
import { OptionsBuilder, OptionsBuilderOutput } from '../options-builder'
import { EntityId } from '../types'

export type RuleExecutorContext = {
    getComponentSchemaById: (componentId: EntityId) => ComponentSchema | null
    getRepeaterChildIds: (componentId: EntityId) => EntityId[] | null
    isTemplateComponentId: (componentId: EntityId) => boolean | null
}

export type RuleExecuteParams<O extends OptionsBuilder<OptionalSerializableObject> = OptionsBuilder<OptionalSerializableObject>> = {
    ctx: RuleExecutorContext
    options: OptionsBuilderOutput<O>
}

export type RuleExecuteParamsWithoutOptions = Omit<RuleExecuteParams<OptionsBuilder<OptionalSerializableObject>>, 'options'>
