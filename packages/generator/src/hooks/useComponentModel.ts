import { EntityId, GeneratorComponentType } from '@form-crafter/core'
import { isEmpty } from '@form-crafter/utils'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'
import { ComponentModelByType } from '../services/components-schemas/models/components'

export const useComponentModel = <T extends GeneratorComponentType = GeneratorComponentType>(id: EntityId): ComponentModelByType<T> => {
    const { services } = useGeneratorContext()

    const data = useStoreMap({
        store: services.componentsSchemasService.componentsModel.$models,
        keys: [id],
        fn: (map, [id]) => map.get(id),
    })

    if (isEmpty(data)) {
        throw new Error(`Missing schema for component ${id}`)
    }

    return data as ComponentModelByType<T>
}
