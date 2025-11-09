import { Breakpoint, ViewDefinition, ViewResponsive } from '@form-crafter/core'

import { getEmptyResponsiveViewElementsGraph } from '../../consts'
import { ViewsElementsGraphs } from '../../types'
import { buildViewElementsGraph } from '../build-view-elements-graph'

export const buildViewElementsGraphs = (
    defaultView: ViewResponsive,
    additionalsViews?: Record<string, Pick<ViewDefinition, 'responsive'>>,
    slots?: Parameters<typeof buildViewElementsGraph>[1],
) => {
    const finalDefault = Object.entries(defaultView).reduce<ViewsElementsGraphs['default']>((result, [breakpoint, { elements }]) => {
        result[breakpoint as Breakpoint] = buildViewElementsGraph(elements, slots)
        return result
    }, getEmptyResponsiveViewElementsGraph())

    const additional = Object.entries(additionalsViews || {}).reduce<ViewsElementsGraphs['additional']>((result, [viewId, { responsive }]) => {
        result[viewId] = Object.entries(responsive).reduce<ViewsElementsGraphs['default']>((result, [breakpoint, { elements }]) => {
            result[breakpoint as Breakpoint] = buildViewElementsGraph(elements, slots)
            return result
        }, getEmptyResponsiveViewElementsGraph())
        return result
    }, {})

    return { default: finalDefault, additional }
}
