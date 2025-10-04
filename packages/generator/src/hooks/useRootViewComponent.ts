import { rootComponentId, ViewComponent } from '@form-crafter/core'
import { useUnit } from 'effector-react'

import { useGeneratorContext } from '../contexts'

export const useRootViewComponent = (): ViewComponent => {
    const { services } = useGeneratorContext()
    const viewResponsive = useUnit(services.viewsService.$currentView)
    // TODO switch on change responsive?
    return viewResponsive.xxl.components[rootComponentId]
}
