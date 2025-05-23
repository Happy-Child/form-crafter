import { ComponentModule } from '@form-crafter/core'
import { createStore } from 'effector'
import { FC } from 'react'

import { init } from './init'
import { ThemeService, ThemeServiceParams } from './types'
import { getDepsPathsRulesComponents } from './utils'

export type { ThemeService, ThemeServiceParams }

export const createThemeService = ({ theme, PlaceholderComponent }: ThemeServiceParams): ThemeService => {
    const $theme = createStore<ComponentModule[]>(theme)
    const $depsPathsRulesComponents = createStore<Record<string, string[][]>>(getDepsPathsRulesComponents(theme))
    const $placeholderComponent = createStore<FC>(PlaceholderComponent)

    init({})

    return {
        $theme,
        $depsPathsRulesComponents,
        $placeholderComponent,
    }
}
