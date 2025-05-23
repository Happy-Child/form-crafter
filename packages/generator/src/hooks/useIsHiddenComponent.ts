import { ComponentSchema, EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'
import {} from 'react'

import { useComponentModel } from './useComponentModel'

export const useIsHiddenComponent = (id: EntityId) => {
    const { $schema } = useComponentModel(id)

    return useStoreMap({
        store: $schema,
        keys: [],
        fn: (data: ComponentSchema) => data.properties.hidden,
    })
}
