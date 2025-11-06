import { isNotEmpty } from '@form-crafter/utils'
import { sample } from 'effector'

import { ComponentsCreatorModel } from '../models/components-creator-model'
import { ComponentsRegistryModel } from '../models/components-registry-model'
import { RepeaterModel } from '../models/repeater-model'

type Params = {
    repeaterModel: RepeaterModel
    componentsRegistryModel: ComponentsRegistryModel
    componentsCreatorModel: ComponentsCreatorModel
}

export const initComponents = ({ repeaterModel, componentsRegistryModel, componentsCreatorModel }: Params) => {
    sample({
        clock: repeaterModel.templateInstanceCreated,
        filter: ({ componentsSchemas }) => isNotEmpty(componentsSchemas),
        fn: ({ componentsSchemas }) => componentsSchemas,
        target: componentsCreatorModel.addComponentsFx,
    })

    sample({
        clock: [componentsCreatorModel.addComponentsFx.doneData, componentsCreatorModel.removeComponentsFx.doneData],
        target: componentsRegistryModel.setComponentsModels,
    })

    sample({
        clock: [componentsCreatorModel.addComponentsFx.doneData, componentsCreatorModel.removeComponentsFx.doneData],
        target: componentsRegistryModel.componentsAddedOrRemoved,
    })
}
