import { OptionalSerializableObject, SerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../../options-builder'
import { RelationRule, RelationRuleWithoutOptions } from './types'

export function createRelationRule(params: RelationRuleWithoutOptions<OptionalSerializableObject>): RelationRuleWithoutOptions<OptionalSerializableObject>

export function createRelationRule<P extends OptionalSerializableObject>(params: RelationRuleWithoutOptions<P>): RelationRuleWithoutOptions<P>

export function createRelationRule<
    P extends OptionalSerializableObject = OptionalSerializableObject,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
>(params: RelationRule<P, O>): RelationRule<P, O>

export function createRelationRule<
    P extends OptionalSerializableObject = OptionalSerializableObject,
    O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>,
>(params: RelationRule<P, O> | RelationRuleWithoutOptions<P>): RelationRule<P, O> | RelationRuleWithoutOptions<P> {
    return params
}
