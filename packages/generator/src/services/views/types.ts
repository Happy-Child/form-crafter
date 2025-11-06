import { Breakpoint, EntityId, ViewElementComponent, Views } from '@form-crafter/core'

import { GeneralService } from '../general'

export type ViewsServiceParams = {
    initial: Views
    generalService: GeneralService
}

export type ViewElementGraphRow = { id: EntityId; parentComponentId: EntityId | null; childrenComponents: EntityId[] }

export type ViewElementGraphComponent = { id: EntityId; parentRowId: EntityId; childrenRows: EntityId[]; layout: ViewElementComponent['layout'] }

export type ViewElementsGraph = {
    rows: {
        root: EntityId[]
        graph: Record<EntityId, ViewElementGraphRow>
    }
    components: Record<EntityId, ViewElementGraphComponent>
}

export type ResponsiveViewElementsGraph = {
    xxl: ViewElementsGraph
} & Partial<Record<Exclude<Breakpoint, 'xxl'>, ViewElementsGraph>>

export type ViewsElementsGraphs = {
    default: ResponsiveViewElementsGraph
    additional: Record<string, ResponsiveViewElementsGraph>
}
