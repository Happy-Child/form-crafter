import { ComponentSchema, EntityId } from '@form-crafter/core'
import { createStore, StoreWritable } from 'effector'
import { useStoreMap, useUnit } from 'effector-react'

import { useGeneratorContext } from '../contexts'

const nullStore = createStore(null)

export const useIsRepeater = (id: EntityId): boolean => {
    const { services } = useGeneratorContext()

    const data = useStoreMap({
        store: services.componentsSchemasService.$schemasMap,
        keys: [id],
        fn: (map, [id]) => map.get(id),
    })

    const schema = useUnit((data?.$schema || nullStore) as StoreWritable<ComponentSchema | null>)

    return schema?.meta?.type === 'repeater'
}
