import { EntityId, ViewElementGraphComponent } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useViewComponent = (id: EntityId): ViewElementGraphComponent => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.viewsService.$currentViewElementsGraph,
        keys: [id],
        fn: (responsiveGraph, [id]) => responsiveGraph.components[id],
    })
}
