import { EntityId, ViewComponent } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useViewComponent = (id: EntityId): ViewComponent => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.viewsService.currentView,
        keys: [id],
        // TODO switch on change responsive?
        fn: ({ xxl }, [id]) => xxl.components[id],
    })
}
