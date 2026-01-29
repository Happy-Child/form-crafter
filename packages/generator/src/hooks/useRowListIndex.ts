import { useMemo } from 'react'

import { ViewElementGraphRow } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { useStoreMap } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useRowListIndex = ({ id: rowId, parentComponentId }: Pick<ViewElementGraphRow, 'id' | 'parentComponentId'>): number => {
    const { services } = useGeneratorContext()

    const rowsIds = useStoreMap({
        store: services.viewsService.$currentViewElementsGraph,
        keys: [parentComponentId],
        fn: (responsiveGraph, [parentComponentId]) => {
            if (isNotEmpty(parentComponentId)) {
                return responsiveGraph.components[parentComponentId].childrenRows || []
            }
            return responsiveGraph.rows.root
        },
    })

    return useMemo(() => rowsIds.findIndex((id) => id === rowId), [rowsIds, rowId])
}
