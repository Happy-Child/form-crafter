import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useIsDynamicContainer = (id: EntityId): boolean => {
    const { services } = useGeneratorContext()

    const type = useStoreMap({
        store: services.componentsSchemasService.$schemas,
        keys: [id],
        fn: (data, [id]) => (isNotEmpty(data[id]) ? data[id].meta.type : null),
    })

    return type === 'dynamic-container'
}
