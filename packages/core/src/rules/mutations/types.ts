import { OptionalSerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../../options-builder'
import { RuleExecuteParams, RuleExecuteParamsWithoutOptions } from '../types'

type GeneralMutationRule = {
    ruleName: string
    displayName: string
}

export type MutationRule<
    P extends OptionalSerializableObject,
    O extends OptionsBuilder<OptionalSerializableObject> = OptionsBuilder<OptionalSerializableObject>,
> = GeneralMutationRule & {
    optionsBuilder: O
    execute: (data: P, params: RuleExecuteParams<O>) => Partial<P> | null
}
export type MutationRuleWithoutOptions<P extends OptionalSerializableObject> = GeneralMutationRule & {
    execute: (data: P, params: RuleExecuteParamsWithoutOptions) => Partial<P> | null
}
