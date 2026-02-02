import { isNotEmpty } from '@form-crafter/utils'
import { sample } from 'effector'
import { combineEvents } from 'patronum'

import { ComponentsService } from './components'
import { RepeaterService } from './repeater'
import { ViewsService } from './views'

type Params = {
    viewsService: ViewsService
    componentsService: ComponentsService
    repeaterService: RepeaterService
}

export const init = ({ viewsService, componentsService, repeaterService }: Params) => {
    // --- INIT REPEATER START
    // Add repeater group
    sample({
        clock: repeaterService.groupGenerated,
        filter: ({ componentsSchemas }) => isNotEmpty(componentsSchemas),
        fn: ({ componentsSchemas }) => componentsSchemas,
        target: componentsService.componentsCreatorModel.createComponentsFx,
    })

    sample({
        clock: combineEvents([repeaterService.groupGenerated, componentsService.componentsRegistryModel.componentsStoreModel.componentsAdded]),
        filter: ([{ viewElementsGraphs, componentsSchemas }]) =>
            isNotEmpty(viewElementsGraphs.default.xxl.rows) && isNotEmpty(viewElementsGraphs.default.xxl.components) && isNotEmpty(componentsSchemas),
        fn: ([{ viewElementsGraphs, rootComponentId }]) => ({ graphsToMerge: viewElementsGraphs, rootComponentId }),
        target: viewsService.mergeViewsElementsGraphs,
    })

    // Remove repeater group
    sample({
        clock: repeaterService.removeGroup,
        fn: ({ repeaterId, rowIndex }) => ({ componentId: repeaterId, rowIndex }),
        target: viewsService.removeGroupViewsElements,
    })

    sample({
        clock: viewsService.groupViewsElementsRemoved,
        fn: ({ componentsIdsToRemove }) => componentsIdsToRemove,
        target: componentsService.clearComponentsData,
    })

    sample({
        clock: [
            combineEvents([viewsService.mergeViewsElementsGraphs, viewsService.viewsElementsGraphsUpdated]),
            combineEvents([viewsService.groupViewsElementsRemoved, viewsService.viewsElementsGraphsUpdated]),
        ],
        target: componentsService.componentsRegistryModel.runCalcChildrenOfComponents,
    })
    // RUN LIFE CYRCLE ТУТ?
    // --- INIT REPEATER END

    // Здесь запускается первичный life cyrcle при init. Нужно учитывать это место, так как views должны быть готовы к этому момент (там используется is successful checker).
    // Кажется его нужно запусткать тут после постройки views и заполнения components на initialValues, либо/и на "initialGroupCount" у каждого repeater компонента.
    componentsService.startInit()
}
