import { ComponentProperties, ComponentType, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useComponentProperties = <T extends ComponentType = ComponentType>(id: EntityId): ComponentProperties<T> => {
    const { services } = useGeneratorContext()

    const properties = useStoreMap({
        store: services.componentsSchemasService.$schemas,
        keys: [id],
        fn: (data, [id]) => (isNotEmpty(data[id]) ? (data[id].properties as ComponentProperties<T>) : null),
    })

    if (isEmpty(properties)) {
        throw new Error(`Missing properties for component ${id}`)
    }

    return properties
}
