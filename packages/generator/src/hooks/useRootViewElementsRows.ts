import { EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useRootViewElementsRows = (): EntityId[] => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.viewsService.$currentViewElementsGraph,
        keys: [],
        fn: (responsiveGraph) => responsiveGraph.rows.root,
    })
}
