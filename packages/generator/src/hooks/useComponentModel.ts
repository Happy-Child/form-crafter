import { ComponentType, EntityId } from '@form-crafter/core'
import { isEmpty } from '@form-crafter/utils'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'
import { ComponentSchemaModelByType } from '../services/components-schemas/components-models'

export const useComponentModel = <T extends ComponentType = ComponentType>(id: EntityId): ComponentSchemaModelByType<T> => {
    const { services } = useGeneratorContext()

    const data = useStoreMap({
        store: services.componentsSchemasService.$componentsSchemasModel,
        keys: [id],
        fn: (map, [id]) => map.get(id),
    })

    if (isEmpty(data)) {
        throw new Error(`Missing schema for component ${id}`)
    }

    return data as ComponentSchemaModelByType<T>
}
