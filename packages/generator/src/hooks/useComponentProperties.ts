import { ComponentProperties, ComponentSchema, ComponentType, EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useComponentModel } from './useComponentModel'

export const useComponentProperties = <T extends ComponentType = ComponentType>(id: EntityId): ComponentProperties<T> => {
    const { $model } = useComponentModel<T>(id)

    const properties = useStoreMap({
        store: $model,
        keys: [],
        fn: (schema: ComponentSchema) => schema.properties,
    })

    return properties as ComponentProperties<T>
}
