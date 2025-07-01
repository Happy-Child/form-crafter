import { OptionalSerializableObject } from '@form-crafter/utils'

import { OptionsBuilder } from '../options-builder'
import { RuleExecuteParams, RuleExecuteParamsWithoutOptions } from '../rules'
import { EntityId } from '../types'

type GeneralConditionOperator = {
    name: string
    displayName: string
    helpText?: string
}

export type ComponentConditionOperator<O extends OptionsBuilder<OptionalSerializableObject> = OptionsBuilder<OptionalSerializableObject>> =
    GeneralConditionOperator & {
        execute: (componentId: EntityId, params: RuleExecuteParams<O>) => boolean
        optionsBuilder: O
    }

export type ComponentConditionOperatorWithoutOptions = GeneralConditionOperator & {
    execute: (componentId: EntityId, params: RuleExecuteParamsWithoutOptions) => boolean
}
