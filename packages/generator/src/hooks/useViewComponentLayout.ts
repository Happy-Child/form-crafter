import { EntityId, ViewComponentLayout } from '@form-crafter/core'
import { useMemo } from 'react'

import { getDefaultViewNodeLayout } from '../consts'
import { useViewComponent } from './useViewComponent'

export const useViewComponentLayout = (id: EntityId): ViewComponentLayout => {
    const { params } = useViewComponent(id)

    const defaultLayout = useMemo(() => getDefaultViewNodeLayout(), [])

    return params?.layout || defaultLayout
}
