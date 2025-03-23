// Repeater child components validation

import { ConditionNode } from '../../conditions'
import { OptionsBuilder, OptionsBuilderOutput } from '../../options-builder'

// {
//     componentId: EntityId
//     options: T['options']
//     fieldsProperties: ComponentsPropertiesData
//     fieldsTree: any
// }

// { options: T; fieldsProperties: ComponentsPropertiesData; fieldsTree: any }

// И как-то потом понимать, что есть оишбки на полях и не invalid=true
// продумать как будет устанавливаться error msg множественно в том числе и куда

export type ValidationRuleParams = {
    ruleName: string
    options: OptionsBuilderOutput<OptionsBuilder>
    condition?: ConditionNode
}

export type ValidationComponentRule = {
    ruleName: string
    kind: 'component'
    displayName: string
    validate: (value: any, params: any) => any
}

export type ValidationFormRule = {
    ruleName: string
    kind: 'form'
    displayName: string
    validate: (params: any) => any
}

export type ValidationRule = ValidationComponentRule | ValidationFormRule
