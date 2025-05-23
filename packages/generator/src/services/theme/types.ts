import { ComponentModule } from '@form-crafter/core'
import { Store } from 'effector'
import { FC } from 'react'

export type ThemeService = {
    $theme: Store<ComponentModule[]>
    $depsPathsRulesComponents: Store<Record<string, string[][]>>
    $placeholderComponent: Store<FC>
}

export type ThemeServiceParams = {
    theme: ComponentModule[]
    PlaceholderComponent: FC
}
