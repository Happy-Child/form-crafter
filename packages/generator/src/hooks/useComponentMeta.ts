import { ComponentSchema, ComponentSchemaByType, ComponentType, EntityId } from '@form-crafter/core'
import { useStoreMap } from 'effector-react'

import { useComponentModel } from './useComponentModel'

export const useComponentMeta = <T extends ComponentType = ComponentType>(id: EntityId): ComponentSchemaByType<T>['meta'] => {
    const { $model } = useComponentModel<T>(id)

    const meta = useStoreMap({
        store: $model,
        keys: [],
        fn: (schema: ComponentSchema) => schema.meta,
    })

    return meta as ComponentSchemaByType<T>['meta']
}
