import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions, ComponentModule, RelationRule } from '@form-crafter/core'
import { OptionalSerializableObject } from '@form-crafter/utils'
import { Store } from 'effector'
import { FC } from 'react'

export type ThemeService = {
    $theme: Store<ComponentModule[]>
    $operatorsForConditions: Store<Record<string, ComponentConditionOperator | ComponentConditionOperatorWithoutOptions>>
    $depsPathsRulesComponents: Store<Record<string, string[][]>>
    $relationsRulesMap: Store<Record<string, RelationRule<OptionalSerializableObject>>>
    $placeholderComponent: Store<FC>
}

export type ThemeServiceParams = {
    theme: ComponentModule[]
    PlaceholderComponent: FC
}
