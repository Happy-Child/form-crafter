import { EntityId } from '@form-crafter/core'

import { useComponentMeta } from './useComponentMeta'

export const useIsSomeContainerComponent = (id: EntityId) => {
    const { type } = useComponentMeta(id)

    return type === 'container' || type === 'dynamic-container'
}
