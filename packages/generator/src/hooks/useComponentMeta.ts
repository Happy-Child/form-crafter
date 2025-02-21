import { ComponentMeta, ComponentType, EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { useStoreMap } from 'effector-react'
import {} from 'react'

import { useGeneratorContext } from '../contexts'

export const useComponentMeta = <T extends ComponentType = ComponentType>(id: EntityId): ComponentMeta<T> => {
    const { services } = useGeneratorContext()

    const meta = useStoreMap({
        store: services.componentsSchemasService.$schemas,
        keys: [id],
        fn: (data, [id]) => (isNotEmpty(data[id]) ? (data[id].meta as ComponentMeta<T>) : null),
    })

    if (isEmpty(meta)) {
        throw new Error(`Missing meta for component ${id}`)
    }

    return meta
}
