import { FC } from 'react'

import { ComponentValidationRule, FormCrafterTheme, GroupValidationRule, isComponentModuleWithValidations } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { combine, createStore } from 'effector'

import { init } from './init'
import { OperatorsStore, ThemeService, ThemeServiceParams } from './types'
import { extractMutations } from './utils'
import { buildPathsToMutationsRulesDeps } from './utils/build-paths-to-mutations-rules-deps'
import { extractOperators } from './utils/extract-operators'

export type { OperatorsStore, ThemeService, ThemeServiceParams }

export * from './utils/public-api'

export const createThemeService = ({ theme, PlaceholderComponent }: ThemeServiceParams): ThemeService => {
    const $theme = createStore<FormCrafterTheme>(theme)

    const $componentsModules = $theme.map(({ componentsModules }) => componentsModules)
    const $componentsModulesMap = $theme.map(({ componentsModules }) => componentsModules.reduce((map, module) => ({ ...map, [module.name]: module }), {}))

    const $mutationsRules = combine($componentsModules, extractMutations)
    const $pathsToMutationsRulesDeps = combine($mutationsRules, buildPathsToMutationsRulesDeps)

    const $groupValidationRules = $theme.map(({ groupValidationRules }) =>
        isNotEmpty(groupValidationRules)
            ? groupValidationRules.reduce<Record<string, GroupValidationRule>>((map, rule) => {
                  map[rule.key] = rule
                  return map
              }, {})
            : {},
    )

    const $componentsValidationsRules = $componentsModules.map((modules) => {
        const rules = modules.flatMap((module) => {
            if (isComponentModuleWithValidations(module)) {
                return module.validations || []
            }
            return []
        })

        return rules.reduce<Record<string, ComponentValidationRule>>((map, rule) => {
            map[rule.key] = rule
            return map
        }, {})
    })

    const $operators = combine($componentsModules, extractOperators)

    const $placeholderComponent = createStore<FC>(PlaceholderComponent)

    init({})

    return {
        $componentsModules,
        $componentsModulesMap,
        $componentsValidationsRules,
        $groupValidationRules,
        $operators,
        $mutationsRules,
        $pathsToMutationsRulesDeps,
        $placeholderComponent,
    }
}
