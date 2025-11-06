import { Breakpoint, breakpoints } from '@form-crafter/core'

export const getBreakpoint = (width: number): Breakpoint => {
    const entries = Object.entries(breakpoints) as [Breakpoint, number][]

    for (const [key, size] of entries) {
        if (width >= size) {
            return key
        }
    }

    return entries[entries.length - 1][0]
}
