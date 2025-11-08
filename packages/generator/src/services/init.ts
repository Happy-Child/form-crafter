import { isNotEmpty } from '@form-crafter/utils'
import { sample } from 'effector'
import { combineEvents } from 'patronum'

import { ComponentsService } from './components'
import { ViewsService } from './views'

type Params = {
    componentsService: ComponentsService
    viewsService: ViewsService
}

export const init = ({ componentsService, viewsService }: Params) => {
    componentsService.startInit()

    sample({
        clock: combineEvents([componentsService.repeaterModel.templateInstanceCreated, componentsService.componentsCreatorModel.addComponentsFx.done]),
        filter: ([{ viewElementsGraphs, componentsSchemas }]) =>
            isNotEmpty(viewElementsGraphs.default.xxl.rows) && isNotEmpty(viewElementsGraphs.default.xxl.components) && isNotEmpty(componentsSchemas),
        fn: ([{ viewElementsGraphs, rootComponentId }]) => ({ graphsToMerge: viewElementsGraphs, rootComponentId }),
        target: viewsService.mergeViewsElementsGraphs,
    })
}
