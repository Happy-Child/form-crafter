import { OptionalSerializableObject } from '@form-crafter/utils'

import { ConditionNode } from '../../conditions'
import { OptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { ComponentSchemaSettings, EntityId } from '../../types'
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

type ExecuteData<P extends OptionalSerializableObject> = { properties: P; settings?: ComponentSchemaSettings }

type ExecuteReturn<P extends OptionalSerializableObject> =
    | { properties: Partial<P>; settings?: Partial<ComponentSchemaSettings> }
    | { properties?: Partial<P>; settings: Partial<ComponentSchemaSettings> }

export type RelationRule<
    P extends OptionalSerializableObject,
    O extends OptionsBuilder<OptionalSerializableObject> = OptionsBuilder<OptionalSerializableObject>,
> = GeneralRelationRule & {
    optionsBuilder: O
    execute: (data: ExecuteData<P>, params: RuleExecuteParams<O>) => ExecuteReturn<P> | null
}
export type RelationRuleWithoutOptions<P extends OptionalSerializableObject> = GeneralRelationRule & {
    execute: (data: ExecuteData<P>, params: RuleExecuteParamsWithoutOptions) => ExecuteReturn<P> | null
}
