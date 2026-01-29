import { ComponentsValidationErrorsModel, EntityId, ReadyConditionalValidationsModel } from '@form-crafter/core'
import { EventCallable, sample } from 'effector'

import { ComponentsCreatorModel } from '../models/components-creator-model'
import { ComponentsRegistryModel } from '../models/components-registry-model'

export type Params = {
    clearComponentsData: EventCallable<Set<EntityId>>
    componentsRegistryModel: ComponentsRegistryModel
    componentsCreatorModel: ComponentsCreatorModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
}

export const initComponents = ({
    clearComponentsData,
    componentsCreatorModel,
    componentsRegistryModel,
    readyConditionalValidationsModel,
    componentsValidationErrorsModel,
}: Params) => {
    sample({
        clock: componentsCreatorModel.createComponentsFx.doneData,
        target: componentsRegistryModel.componentsStoreModel.addComponentsModels,
    })

    sample({
        clock: clearComponentsData,
        target: [
            componentsRegistryModel.componentsStoreModel.removeComponentsModels,
            readyConditionalValidationsModel.removeReadyRulesByComponentsIds,
            componentsValidationErrorsModel.removeAllComponentsErrors,
        ],
    })
}
