import { ComponentsModels, RunMutationsOnUserActionPayload } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'

import { init } from './init'
import { createChangeViewsModel } from './models/change-views-model'
import { createComponentModel } from './models/component-model'
import { createComponentsCreatorModel } from './models/components-creator-model'
import { createComponentsGeneralModel } from './models/components-general-model'
import { createComponentsRegistryModel } from './models/components-registry-model'
import { createComponentsValidationErrorsModel } from './models/components-validation-errors-model'
import { createDepsOfRulesModel } from './models/deps-of-rules-model'
import { createFormValidationModel } from './models/form-validation-model'
import { createMutationsModel } from './models/mutations-model'
import { createReadyConditionalValidationsModel } from './models/ready-conditional-validations-model'
import { createRepeaterModel } from './models/repeater-model'
import { ComponentsServiceParams } from './types'

export type ComponentsService = ReturnType<typeof createComponentsService>

export const createComponentsService = ({ appErrorsService, themeService, viewsService, schemaService }: ComponentsServiceParams) => {
    const $firstMutationsIsDone = createStore(false)
    const setFirstMutationsToDone = createEvent('setFirstMutationsToDone')
    $firstMutationsIsDone.on(setFirstMutationsToDone, () => true)

    const runMutationsOnUserAction = createEvent<RunMutationsOnUserActionPayload>('runMutationsOnUserAction')

    const startInit = createEvent('startInit')

    const componentsRegistryModel = createComponentsRegistryModel({ themeService, viewsService })

    const componentsGeneralModel = createComponentsGeneralModel()

    const depsOfRulesModel = createDepsOfRulesModel({
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
        componentsRegistryModel,
    })

    const componentsValidationErrorsModel = createComponentsValidationErrorsModel({ componentsGeneralModel })

    const readyConditionalValidationsModel = createReadyConditionalValidationsModel({
        depsOfRulesModel,
        componentsRegistryModel,
        schemaService,
    })

    const initialComponentsSchemas = Object.entries(schemaService.$initialSchema.getState().componentsSchemas)
    componentsRegistryModel.init(
        initialComponentsSchemas.reduce<ComponentsModels>((map, [componentId, componentSchema]) => {
            const model = createComponentModel({
                runMutations: runMutationsOnUserAction,
                schema: componentSchema,
                themeService,
                schemaService,
                componentsRegistryModel,
                componentsValidationErrorsModel,
                readyConditionalValidationsModel,
            })
            map.set(componentId, model)
            return map
        }, new Map()),
    )

    const componentsCreatorModel = createComponentsCreatorModel({
        runMutations: runMutationsOnUserAction,
        themeService,
        viewsService,
        schemaService,
        componentsRegistryModel,
        componentsValidationErrorsModel,
        readyConditionalValidationsModel,
    })

    const repeaterModel = createRepeaterModel({
        componentsRegistryModel,
    })

    const formValidationModel = createFormValidationModel({
        themeService,
        schemaService,
        componentsRegistryModel,
        componentsValidationErrorsModel,
        readyConditionalValidationsModel,
    })

    const mutationsModel = createMutationsModel({
        themeService,
        schemaService,
        componentsGeneralModel,
        componentsRegistryModel,
    })

    const changeViewsModel = createChangeViewsModel({
        viewsService,
        componentsRegistryModel,
        depsOfRulesModel,
        $firstMutationsIsDone,
    })

    init({
        runMutationsOnUserAction,
        startInit,
        viewsService,
        componentsRegistryModel,
        componentsGeneralModel,
        componentsCreatorModel,
        repeaterModel,
        componentsValidationErrorsModel,
        depsOfRulesModel,
        readyConditionalValidationsModel,
        formValidationModel,
        mutationsModel,
        changeViewsModel,
        $firstMutationsIsDone,
        setFirstMutationsToDone,
    })

    return {
        componentsRegistryModel,
        componentsCreatorModel,
        depsOfRulesModel,
        formValidationModel,
        repeaterModel,
        startInit,
    }
}
