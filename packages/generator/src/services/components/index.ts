import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { createEvent, createStore } from 'effector'

import { init } from './init'
import { createChangeViewsModel } from './models/change-views-model'
import { createComponentsModel } from './models/components-model'
import { createComponentsValidationErrorsModel } from './models/components-validation-errors-model'
import { createDepsOfRulesModel } from './models/deps-of-rules-model'
import { createFormValidationModel } from './models/form-validation-model'
import { createMutationsModel } from './models/mutations-model'
import { createReadyConditionalValidationsModel } from './models/ready-conditional-validations-model'
import { createRepeaterModel } from './models/repeater-model'
import { ComponentsServiceParams, RunMutationsOnUserActionsPayload } from './types'

export type ComponentsService = ReturnType<typeof createComponentsService>

export const createComponentsService = ({ appErrorsService, themeService, viewsService, schemaService }: ComponentsServiceParams) => {
    const $firstMutationsIsDone = createStore(false)
    const setFirstMutationsToDone = createEvent('setFirstMutationsToDone')
    $firstMutationsIsDone.on(setFirstMutationsToDone, () => true)

    const initService = createEvent('initService')
    const runMutationsOnUserActions = createEvent<RunMutationsOnUserActionsPayload>('runMutationsOnUserActions')

    const componentsModel = createComponentsModel({ themeService, viewsService, schemaService })

    const repeaterModel = createRepeaterModel({ viewsService, componentsModel })

    const depsOfRulesModel = createDepsOfRulesModel({
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
        componentsModel,
    })

    const componentsValidationErrorsModel = createComponentsValidationErrorsModel({ componentsModel })

    const readyConditionalValidationsModel = createReadyConditionalValidationsModel({
        depsOfRulesModel,
        componentsModel,
        schemaService,
    })

    componentsModel.init({
        runMutations: runMutationsOnUserActions,
        readyConditionalValidationsModel,
        componentsValidationErrorsModel,
        themeService,
        schemaService,
    })

    const formValidationModel = createFormValidationModel({
        componentsModel,
        componentsValidationErrorsModel,
        readyConditionalValidationsModel,
        themeService,
        schemaService,
    })

    const mutationsModel = createMutationsModel({
        componentsModel,
        themeService,
        schemaService,
    })

    const changeViewsModel = createChangeViewsModel({
        componentsModel,
        depsOfRulesModel,
        viewsService,
        $firstMutationsIsDone,
    })

    init({
        viewsService,
        componentsModel,
        repeaterModel,
        componentsValidationErrorsModel,
        depsOfRulesModel,
        readyConditionalValidationsModel,
        formValidationModel,
        mutationsModel,
        changeViewsModel,
        initService,
        $firstMutationsIsDone,
        runMutationsOnUserActions,
        setFirstMutationsToDone,
    })

    // OLD BEGIN
    const updateComponentsSchemas = createEvent<ComponentsSchemas>('updateComponentsSchemas')
    const removeComponentsSchemasByIds = createEvent<{ ids: EntityId[] }>('removeComponentsSchemasByIds')

    // $schemas
    //     .on(updateComponentsSchemas, (curData, data) => ({
    //         ...curData,
    //         ...data,
    //     }))
    //     .on(removeComponentsSchemasByIds, (curData, { ids }) =>
    //         Object.fromEntries(Object.entries(curData).filter(([componentId]) => !ids.includes(componentId))),
    //     )
    // OLD END

    return {
        componentsModel,
        depsOfRulesModel,
        formValidationModel,
        repeaterModel,
        initService,
        updateComponentsSchemas,
        removeComponentsSchemasByIds,
    }
}
