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
import { ComponentsService, ComponentsServiceParams, RunMutationsOnUserActionsPayload } from './types'

export type { ComponentsService }

export const createComponentsService = ({ appErrorsService, themeService, viewsService, schemaService }: ComponentsServiceParams): ComponentsService => {
    const $firstMutationsIsDone = createStore(false)
    const setFirstMutationsToDone = createEvent('setFirstMutationsToDone')
    $firstMutationsIsDone.on(setFirstMutationsToDone, () => true)

    const initServiceEvent = createEvent('initServiceEvent')
    const runMutationsOnUserActionsEvent = createEvent<RunMutationsOnUserActionsPayload>('runMutationsOnUserActionsEvent')

    const componentsModel = createComponentsModel({ themeService, viewsService, schemaService })

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
        runMutationsEvent: runMutationsOnUserActionsEvent,
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
        componentsValidationErrorsModel,
        depsOfRulesModel,
        readyConditionalValidationsModel,
        formValidationModel,
        mutationsModel,
        changeViewsModel,
        initServiceEvent,
        $firstMutationsIsDone,
        runMutationsOnUserActionsEvent,
        setFirstMutationsToDone,
    })

    // OLD BEGIN
    const updateComponentsSchemasEvent = createEvent<ComponentsSchemas>('updateComponentsSchemasEvent')
    const removeComponentsSchemasByIdsEvent = createEvent<{ ids: EntityId[] }>('removeComponentsSchemasByIdsEvent')

    // $schemas
    //     .on(updateComponentsSchemasEvent, (curData, data) => ({
    //         ...curData,
    //         ...data,
    //     }))
    //     .on(removeComponentsSchemasByIdsEvent, (curData, { ids }) =>
    //         Object.fromEntries(Object.entries(curData).filter(([componentId]) => !ids.includes(componentId))),
    //     )
    // OLD END

    return {
        componentsModel,
        depsOfRulesModel,
        formValidationModel,
        initServiceEvent,
        updateComponentsSchemasEvent,
        removeComponentsSchemasByIdsEvent,
    }
}
