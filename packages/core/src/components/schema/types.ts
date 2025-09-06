import { AvailableObject } from '@form-crafter/utils'

import { ConditionNode } from '../../conditions'
import { OptionsBuilder, OptionsBuilderOutput } from '../../options-builder'
import { EntityId } from '../../types'
import { ComponentType } from '../types'

export type ComponentVisability = { hidden?: boolean; condition?: ConditionNode }

export type ValidationsConfigs = {
    disableSelf?: boolean
    disableChildren?: boolean
}

export type ValidationRuleSchema = {
    id: EntityId
    key: string
    options?: OptionsBuilderOutput<OptionsBuilder<AvailableObject>>
    condition?: ConditionNode
}

export type MutationRuleSchema = {
    id: EntityId
    key: string
    options?: OptionsBuilderOutput<OptionsBuilder<AvailableObject>>
    condition?: ConditionNode
}

export type ComponentValidations = {
    configs?: ValidationsConfigs
    schemas: ValidationRuleSchema[]
}

export type ComponentMutations = {
    schemas: MutationRuleSchema[]
}

export type GeneralComponentSchema = {
    visability?: ComponentVisability
    validations?: ComponentValidations
    mutations?: ComponentMutations
}

export type ComponentMeta<T extends ComponentType> = {
    id: EntityId
    templateId?: EntityId
    type: T
    name: string
    formKey?: string
}

export type ComponentMetaAsStringType = Omit<ComponentMeta<ComponentType>, 'type'> & {
    type: string
}
