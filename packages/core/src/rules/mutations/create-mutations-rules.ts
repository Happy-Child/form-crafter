import { OptionalSerializableObject, SerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../../options-builder'
import { MutationRule, MutationRuleWithoutOptions } from './types'

export function createMutationRule(params: MutationRuleWithoutOptions<OptionalSerializableObject>): MutationRuleWithoutOptions<OptionalSerializableObject>

export function createMutationRule<P extends OptionalSerializableObject>(params: MutationRuleWithoutOptions<P>): MutationRuleWithoutOptions<P>

export function createMutationRule<
    P extends OptionalSerializableObject = OptionalSerializableObject,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
>(params: MutationRule<P, O>): MutationRule<P, O>

export function createMutationRule<
    P extends OptionalSerializableObject = OptionalSerializableObject,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
>(params: MutationRule<P, O> | MutationRuleWithoutOptions<P>): MutationRule<P, O> | MutationRuleWithoutOptions<P> {
    return params
}
