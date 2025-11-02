import { useMemo } from 'react'

import { EntityId } from '@form-crafter/core'

import { useViewComponent } from './useViewComponent'

export const useRowListIndex = (parentId: EntityId, rowId: EntityId): number => {
    const { childrenRows } = useViewComponent(parentId)

    return useMemo(() => childrenRows.findIndex((id) => id === rowId), [childrenRows, rowId])
}
