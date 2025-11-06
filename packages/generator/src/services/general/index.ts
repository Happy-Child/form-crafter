import { Breakpoint, getWindowWidth } from '@form-crafter/core'
import { createEvent, createStore, sample } from 'effector'
import { readonly, throttle } from 'patronum'

import { getBreakpoint } from './utils'

export * from './types'

export type GeneralService = ReturnType<typeof createGeneralService>

export const createGeneralService = () => {
    const $currentBreakpoint = createStore<Breakpoint>(getBreakpoint(getWindowWidth()))

    const calcCurrentBreakpoint = createEvent<{ width: number }>('calcCurrentBreakpoint')
    const setCurrentBreakpoint = createEvent('setCurrentBreakpoint')

    sample({
        clock: throttle(calcCurrentBreakpoint, 50),
        fn: ({ width }) => getBreakpoint(width),
        target: setCurrentBreakpoint,
    })

    $currentBreakpoint.on(setCurrentBreakpoint, (_, breakpoint) => breakpoint)

    return { $currentBreakpoint: readonly($currentBreakpoint), calcCurrentBreakpoint }
}
