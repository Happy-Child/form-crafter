import { useLayoutEffect } from 'react'

import { Breakpoint, getWindowWidth } from '@form-crafter/core'
import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useBreakpoint = (): Breakpoint => {
    const { services } = useGeneratorContext()

    const [currentBreakpoint, calcCurrentBreakpoint] = useUnit([services.generalService.$currentBreakpoint, services.generalService.calcCurrentBreakpoint])

    useLayoutEffect(() => {
        const execute = () => {
            calcCurrentBreakpoint({ width: getWindowWidth() })
        }

        window.addEventListener('resize', execute)

        execute()

        return () => window.removeEventListener('resize', execute)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return currentBreakpoint
}
