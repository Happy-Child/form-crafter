import { useLayoutEffect, useState } from 'react'

import { Breakpoint, breakpoints } from '@form-crafter/core'

export const useBreakpoint = (): Breakpoint => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('xxl')

    useLayoutEffect(() => {
        return () => {
            console.log('unsub')
        }
    }, [])

    return breakpoint
}
