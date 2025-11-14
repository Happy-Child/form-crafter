import { Breakpoint, ResponsiveViewElementsGraph, ViewElementsGraph } from '@form-crafter/core'

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
