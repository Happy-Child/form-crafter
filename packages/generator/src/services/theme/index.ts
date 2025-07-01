import { ComponentModule } from '@form-crafter/core'
import { combine, createStore } from 'effector'
import { FC } from 'react'

import { init } from './init'
import { ThemeService, ThemeServiceParams } from './types'
import { extractRelationsRules, getDepsPathsRulesComponents } from './utils'
import { extractOperatorsForConditions } from './utils/extract-operators-for-conditions'

export type { ThemeService, ThemeServiceParams }

export const createThemeService = ({ theme, PlaceholderComponent }: ThemeServiceParams): ThemeService => {
    const $theme = createStore<ComponentModule[]>(theme)

    const $relationsRules = combine($theme, extractRelationsRules)

    const $relationsRulesMap = combine($relationsRules, (rules) => rules.reduce((map, rule) => ({ ...map, [rule.ruleName]: rule }), {}))

    const $depsPathsRulesComponents = combine($relationsRules, getDepsPathsRulesComponents)

    const $operatorsForConditions = combine($theme, extractOperatorsForConditions)

    const $placeholderComponent = createStore<FC>(PlaceholderComponent)

    init({})

    return {
        $theme,
        $depsPathsRulesComponents,
        $operatorsForConditions,
        $relationsRulesMap,
        $placeholderComponent,
    }
}
