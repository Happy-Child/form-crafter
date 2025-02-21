import { EntityId, isViewComponentWithRows, ViewComponentWithRows } from '@form-crafter/core'

import { useViewComponent } from './useViewComponent'

export const useViewComponentWithRows = (id: EntityId): ViewComponentWithRows => {
    const data = useViewComponent(id)

    if (!isViewComponentWithRows(data)) {
        throw new Error(`Missing or empty rows for component ${id}`)
    }

    return data
}
