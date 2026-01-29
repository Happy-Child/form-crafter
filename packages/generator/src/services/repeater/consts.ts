import { ResponsiveViewElementsGraph, ViewElementsGraph } from '@form-crafter/core'

export const getEmptyViewElementsGraph = (): ViewElementsGraph => ({ rows: { root: [], graph: {} }, components: {} })

export const getEmptyResponsiveViewElementsGraph = (): ResponsiveViewElementsGraph => ({ xxl: getEmptyViewElementsGraph() })
