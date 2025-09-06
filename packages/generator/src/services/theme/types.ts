import { FC } from 'react'

import { ComponentConditionOperator, ComponentModule, ComponentValidationRule, FormCrafterTheme, GroupValidationRule, MutationRule } from '@form-crafter/core'
import { Store } from 'effector'

export type OperatorsStore = Store<Record<string, ComponentConditionOperator>>

export type ThemeService = {
    $componentsModules: Store<ComponentModule[]>
    $componentsModulesMap: Store<Record<string, ComponentModule>>
    $componentsValidationsRules: Store<Record<string, ComponentValidationRule>>
    $groupValidationRules: Store<Record<string, GroupValidationRule>>
    $operators: OperatorsStore
    $mutationsRules: Store<Record<string, MutationRule>>
    $placeholderComponent: Store<FC>
}

export type ThemeServiceParams = {
    theme: FormCrafterTheme
    PlaceholderComponent: FC
}
