import { EntityId, ViewElementGraphRow } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useViewRow = (id: EntityId): ViewElementGraphRow => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.viewsService.$currentViewElementsGraph,
        keys: [id],
        fn: (responsiveGraph, [id]) => responsiveGraph.rows.graph[id],
    })
}
