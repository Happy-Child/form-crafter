import { ComponentSchema, EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { createStore, StoreWritable } from 'effector'
import { useStoreMap, useUnit } from 'effector-react'

import { useGeneratorContext } from '../contexts'

const nullStore = createStore(null)

export const useIsRepeater = (componentId: EntityId | null): boolean => {
    const { services } = useGeneratorContext()

    const data = useStoreMap({
        store: services.componentsService.componentsRegistryModel.$componentsModels,
        keys: [componentId],
        fn: (map, [id]) => (isNotEmpty(id) ? map.get(id) : null),
    })

    const schema = useUnit((data?.$schema || nullStore) as StoreWritable<ComponentSchema | null>)

    return schema?.meta?.type === 'repeater'
}
