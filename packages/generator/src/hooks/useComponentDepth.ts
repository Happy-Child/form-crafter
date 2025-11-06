import { EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'
import { getComponentDepth } from '../utils'

export const useComponentDepth = (id: EntityId): number => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.viewsService.$currentViewElementsGraph,
        keys: [id],
        fn: (responsiveGraph, [id]) => getComponentDepth(id, responsiveGraph),
    })
}
