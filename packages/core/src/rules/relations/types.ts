import { OptionalSerializableObject } from '@form-crafter/utils'

import { ConditionNode } from '../../conditions'
import { OptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { EntityId } from '../../types'
import { RuleExecuteParams, RuleExecuteParamsWithoutOptions } from '../types'

export type RelationRuleUserOptions = {
    id: EntityId
    ruleName: string
    options?: OptionsBuilderOutput<OptionsBuilder<OptionalSerializableObject>>
    condition?: ConditionNode
}

export type RelationRuleUserOptionsWithCondition = Omit<RelationRuleUserOptions, 'condition'> & {
    condition: ConditionNode
}

type GeneralRelationRule = {
    ruleName: string
    displayName: string
}

export type RelationRule<
    P extends OptionalSerializableObject,
    O extends OptionsBuilder<OptionalSerializableObject> = OptionsBuilder<OptionalSerializableObject>,
> = GeneralRelationRule & {
    optionsBuilder: O
    execute: (data: P, params: RuleExecuteParams<O>) => Partial<P> | null
}
export type RelationRuleWithoutOptions<P extends OptionalSerializableObject> = GeneralRelationRule & {
    execute: (data: P, params: RuleExecuteParamsWithoutOptions) => Partial<P> | null
}
