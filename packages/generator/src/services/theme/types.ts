import {
    ComponentConditionOperator,
    ComponentConditionOperatorWithoutOptions,
    ComponentModule,
    ComponentValidationRule,
    FormCrafterTheme,
    FormValidationRule,
    RelationRule,
} from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { Store } from 'effector'
import { FC } from 'react'

export type OperatorsForConditionsStore = Store<Record<string, ComponentConditionOperator | ComponentConditionOperatorWithoutOptions>>

export type ThemeService = {
    $componentsModules: Store<ComponentModule[]>
    $componentsModulesMap: Store<Record<string, ComponentModule>>
    $componentsValidationsRules: Store<Record<string, ComponentValidationRule>>
    $formValidationsRules: Store<FormValidationRule[] | null>
    $operatorsForConditions: OperatorsForConditionsStore
    $relationsRules: Store<Record<string, RelationRule<OptionalSerializableObject>>>
    $placeholderComponent: Store<FC>
}

export type ThemeServiceParams = {
    theme: FormCrafterTheme
    PlaceholderComponent: FC
}
