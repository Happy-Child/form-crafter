import { isNotEmpty } from '@form-crafter/utils'
import { sample } from 'effector'

import { ComponentsService } from './components'
import { ViewsService } from './views'

type Params = {
    componentsService: ComponentsService
    viewsService: ViewsService
}

export const init = ({ componentsService, viewsService }: Params) => {
    componentsService.startInit()

    sample({
        clock: componentsService.repeaterModel.templateInstanceCreated,
        filter: ({ viewElementsGraphs, componentsSchemas }) =>
            isNotEmpty(viewElementsGraphs.default.xxl.rows) && isNotEmpty(viewElementsGraphs.default.xxl.components) && isNotEmpty(componentsSchemas),
        fn: ({ viewElementsGraphs }) => viewElementsGraphs,
        target: viewsService.mergeViewsElementsGraphs,
    })
}
