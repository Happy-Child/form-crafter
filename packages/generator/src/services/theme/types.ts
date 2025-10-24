import { FC } from 'react'

import { ComponentConditionOperator, FormCrafterTheme } from '@form-crafter/core'
import { Store } from 'effector'

export type OperatorsStore = Store<Record<string, ComponentConditionOperator>>

export type ThemeServiceParams = {
    theme: FormCrafterTheme
    PlaceholderComponent: FC
}
