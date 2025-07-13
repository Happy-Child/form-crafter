import { ComponentProperties, ComponentSchema, ComponentType, EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useComponentModel } from './useComponentModel'

export const useComponentProperties = <T extends ComponentType = ComponentType>(id: EntityId): ComponentProperties<T> => {
    const { $schema } = useComponentModel<T>(id)

    const properties = useStoreMap({
        store: $schema,
        keys: [],
        fn: (schema: ComponentSchema) => schema.properties,
    })

    return properties as ComponentProperties<T>
}
