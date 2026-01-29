import { Breakpoint } from '../../../types'
import { ResponsiveViewElementsGraph, ViewElementsGraph } from '../../types'

export const selectViewByBreakpoint = (breakpoint: Breakpoint, responsiveView: ResponsiveViewElementsGraph): ViewElementsGraph => {
    if (breakpoint in responsiveView) {
        return responsiveView[breakpoint]!
    }

    const { xxl, xl, lg, md, sm, xs } = responsiveView
    const finalXl = xl ?? xxl
    const finalLg = lg ?? finalXl
    const finalMd = md ?? finalLg
    const finalSm = sm ?? finalMd
    const finalXs = xs ?? finalSm

    return {
        xxl: xxl,
        xl: finalXl,
        lg: finalLg,
        md: finalMd,
        sm: finalSm,
        xs: finalXs,
    }[breakpoint]
}
