import { EntityId, ViewRow } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useViewRow = (id: EntityId): ViewRow => {
    const { services } = useGeneratorContext()
    return useStoreMap({
        store: services.viewsService.$currentView,
        keys: [id],
        // TODO switch on change responsive?
        fn: ({ xxl }, [id]) => xxl.rows[id],
    })
}
