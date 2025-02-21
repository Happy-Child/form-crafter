import { rootComponentId, ViewComponent } from '@form-crafter/core'
import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useRootViewComponent = (): ViewComponent => {
    const { services } = useGeneratorContext()
    const viewDefinition = useUnit(services.viewsService.currentView)
    return viewDefinition.components[rootComponentId]
}
