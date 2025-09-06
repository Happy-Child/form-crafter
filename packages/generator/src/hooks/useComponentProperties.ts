import { ComponentSchema, EntityId, GeneratorComponentProperties, GeneratorComponentType } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useComponentModel } from './useComponentModel'

export const useComponentProperties = <T extends GeneratorComponentType = GeneratorComponentType>(id: EntityId): GeneratorComponentProperties<T> => {
    const { $schema } = useComponentModel<T>(id)

    const properties = useStoreMap({
        store: $schema,
        keys: [],
        fn: (schema: ComponentSchema) => schema.properties,
    })

    return properties as GeneratorComponentProperties<T>
}
