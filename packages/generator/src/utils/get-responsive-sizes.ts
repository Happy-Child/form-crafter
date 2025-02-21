import { ViewComponentLayout } from '@form-crafter/core'

export const getResponsiveLayoutSizes = (col: ViewComponentLayout['col']): Required<ViewComponentLayout['col']> => {
    const { default: def, xxl, xl, lg, md, sm } = col
    return {
        default: def,
        xxl: xxl ?? def,
        xl: xl ?? xxl ?? def,
        lg: lg ?? xl ?? xxl ?? def,
        md: md ?? lg ?? xl ?? xxl ?? def,
        sm: sm ?? md ?? lg ?? xl ?? xxl ?? def,
    }
}
