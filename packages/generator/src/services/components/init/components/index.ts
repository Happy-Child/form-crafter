import { ComponentsValidationErrorsModel, ReadyConditionalValidationsModel } from '@form-crafter/core'

import { ViewsService } from '../../../views'
import { ComponentsCreatorModel } from '../../models/components-creator-model'
import { ComponentsRegistryModel } from '../../models/components-registry-model'
import { RepeaterModel } from '../../models/repeater-model'
import { initAddComponents } from './init-add-components'
import { initRemoveComponents } from './init-remove-components'

export type Params = {
    viewsService: ViewsService
    repeaterModel: RepeaterModel
    componentsRegistryModel: ComponentsRegistryModel
    componentsCreatorModel: ComponentsCreatorModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
}

export const initComponents = (params: Params) => {
    initAddComponents(params)
    initRemoveComponents(params)
}
