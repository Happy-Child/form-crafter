import { ComponentSchema, EntityId, GeneratorComponentSchemaByType, GeneratorComponentType } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useComponentModel } from './useComponentModel'

export const useComponentMeta = <T extends GeneratorComponentType = GeneratorComponentType>(id: EntityId): GeneratorComponentSchemaByType<T>['meta'] => {
    const { $schema } = useComponentModel<T>(id)

    const meta = useStoreMap({
        store: $schema,
        keys: [],
        fn: (schema: ComponentSchema) => schema.meta,
    })

    return meta as GeneratorComponentSchemaByType<T>['meta']
}
