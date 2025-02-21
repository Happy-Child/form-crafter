import { EntityId } from '@form-crafter/core'
import { useMemo } from 'react'

import { useViewComponentWithRows } from './useViewComponentWithRows'

export const useRowListIndex = (parentId: EntityId, rowId: EntityId): number => {
    const { rows } = useViewComponentWithRows(parentId)

    return useMemo(() => rows.findIndex(({ id }) => id === rowId), [rows, rowId])
}
