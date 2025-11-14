import { isNotEmpty } from '@form-crafter/utils'
import { sample } from 'effector'
import { combineEvents } from 'patronum'

import { Params } from '.'

export const initAddComponents = ({ viewsService, repeaterModel, componentsRegistryModel, componentsCreatorModel }: Params) => {
    sample({
        clock: repeaterModel.groupToAdd,
        filter: ({ componentsSchemas }) => isNotEmpty(componentsSchemas),
        fn: ({ componentsSchemas }) => componentsSchemas,
        target: componentsCreatorModel.createComponentsFx,
    })

    sample({
        clock: componentsCreatorModel.createComponentsFx.doneData,
        target: componentsRegistryModel.addComponentsModels,
    })

    sample({
        clock: combineEvents([repeaterModel.groupToAdd, componentsRegistryModel.componentsAdded]),
        filter: ([{ viewElementsGraphs, componentsSchemas }]) =>
            isNotEmpty(viewElementsGraphs.default.xxl.rows) && isNotEmpty(viewElementsGraphs.default.xxl.components) && isNotEmpty(componentsSchemas),
        fn: ([{ viewElementsGraphs, rootComponentId }]) => ({ graphsToMerge: viewElementsGraphs, rootComponentId }),
        target: viewsService.mergeViewsElementsGraphs,
    })
}
