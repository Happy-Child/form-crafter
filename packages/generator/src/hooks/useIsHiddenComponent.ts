import { ComponentSchema, EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'
import {} from 'react'

import { useComponentModel } from './useComponentModel'

export const useIsHiddenComponent = (id: EntityId) => {
    const { $model } = useComponentModel(id)

    return useStoreMap({
        store: $model,
        keys: [],
        fn: (data: ComponentSchema) => data.visability?.hidden,
    })
}
