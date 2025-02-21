import { EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'
import {} from 'react'

import { useGeneratorContext } from '../contexts'

export const useIsHiddenComponent = (id: EntityId) => {
    const { services } = useGeneratorContext()

    return useStoreMap({
        store: services.componentsSchemasService.$schemas,
        keys: [id],
        fn: (data, [id]) => data[id].hidden === true,
    })
}
