import { ComponentValidationRule, FormCrafterTheme, isComponentModuleWithValidations } from '@form-crafter/core'
import { combine, createStore } from 'effector'
import { FC } from 'react'

import { init } from './init'
import { OperatorsForConditionsStore, ThemeService, ThemeServiceParams } from './types'
import { extractRelationsRules } from './utils'
import { extractOperatorsForConditions } from './utils/extract-operators-for-conditions'

export type { OperatorsForConditionsStore, ThemeService, ThemeServiceParams }

export const createThemeService = ({ theme, PlaceholderComponent }: ThemeServiceParams): ThemeService => {
    const $theme = createStore<FormCrafterTheme>(theme)

    const $componentsModules = $theme.map(({ componentsModules }) => componentsModules)
    const $componentsModulesMap = $theme.map(({ componentsModules }) => componentsModules.reduce((map, module) => ({ ...map, [module.name]: module }), {}))
    const $relationsRules = combine($componentsModules, extractRelationsRules)

    const $formValidationsRules = $theme.map(({ formValidationsRules }) => formValidationsRules || null)
    const $componentsValidationsRules = $componentsModules.map((modules) => {
        const rules = modules.flatMap((module) => {
            if (isComponentModuleWithValidations(module)) {
                return (module.validationsRules as ComponentValidationRule[]) || []
            }
            return []
        })

        return rules.reduce<Record<string, ComponentValidationRule>>((map, rule) => {
            map[rule.ruleName] = rule
            return map
        }, {})
    })

    const $operatorsForConditions = combine($componentsModules, extractOperatorsForConditions)

    const $placeholderComponent = createStore<FC>(PlaceholderComponent)

    init({})

    return {
        $componentsModules,
        $componentsModulesMap,
        $componentsValidationsRules,
        $formValidationsRules,
        $operatorsForConditions,
        $relationsRules,
        $placeholderComponent,
    }
}
