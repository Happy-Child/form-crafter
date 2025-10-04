import { EntityId, getComponentDepth } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useComponentDepth = (id: EntityId): number => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.viewsService.$currentView,
        keys: [id],
        fn: ({ xxl }, [id]) => getComponentDepth(id, xxl.components),
    })
}
