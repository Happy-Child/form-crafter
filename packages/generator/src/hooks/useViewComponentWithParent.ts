import { EntityId, isViewComponentWithParent, ViewComponentWithParent } from '@form-crafter/core'

import { useViewComponent } from './useViewComponent'

export const useViewComponentWithParent = (id: EntityId): ViewComponentWithParent => {
    const data = useViewComponent(id)

    if (!isViewComponentWithParent(data)) {
        throw new Error(`Missing parentId for component ${id}`)
    }

    return data
}
