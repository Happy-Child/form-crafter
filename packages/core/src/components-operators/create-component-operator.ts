import { SerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../options-builder'
import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions } from './types'

export function createComponentConditionOperator(params: ComponentConditionOperatorWithoutOptions): ComponentConditionOperatorWithoutOptions

export function createComponentConditionOperator<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>>(
    params: ComponentConditionOperator<O>,
): ComponentConditionOperator<O>

export function createComponentConditionOperator<O extends OptionsBuilder<SerializableObject> = OptionsBuilder<SerializableObject>>(
    params: ComponentConditionOperator<O> | ComponentConditionOperatorWithoutOptions,
): ComponentConditionOperator<O> | ComponentConditionOperatorWithoutOptions {
    return params
}
