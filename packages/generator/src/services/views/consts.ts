import { ResponsiveViewElementsGraph, ViewElementsGraph } from './types'

export const getEmptyViewElementsGraph = (): ViewElementsGraph => ({ rows: { root: [], graph: {} }, components: {} })

export const getEmptyResponsiveViewElementsGraph = (): ResponsiveViewElementsGraph => ({ xxl: getEmptyViewElementsGraph() })
