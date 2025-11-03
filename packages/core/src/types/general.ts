import { MaskitoOptions } from '@maskito/core'

import { maxColSpan } from '../consts'

export type ResponsiveSizes<T> = {
    default: T
    xxl?: T
    xl?: T
    lg?: T
    md?: T
    sm?: T
    xs?: T
}

export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'

export type ColSpan = 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | typeof maxColSpan

export type MaskOptions = MaskitoOptions

export type SelectionOption = {
    label: string
    value: string
}

export type EntityId = string

export type PathToRulesDeps = Record<string, string[][]>
