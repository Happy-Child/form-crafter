import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { createEvent } from 'effector'

import { init } from './init'
import { createChangeViewsModel } from './models/change-views-model'
import { createComponentsModels } from './models/components'
import { createComponentsModel } from './models/components-model'
import { createComponentsValidationErrorsModel } from './models/components-validation-errors-model'
import { createDepsOfRulesModel } from './models/deps-of-rules-model'
import { createFormValidationModel } from './models/form-validation-model'
import { createMutationsRulesModel } from './models/mutations-rules-model'
import { createReadyConditionalValidationRulesModel } from './models/ready-conditional-validation-rules-model'
import { createVisabilityComponentsModel } from './models/visability-components-model'
import { ComponentsSchemasService, ComponentsSchemasServiceParams, RunMutationsOnUserActionsPayload } from './types'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({
    initial,
    appErrorsService,
    themeService,
    viewsService,
    schemaService,
}: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const additionalTriggers = schemaService.$schema.getState().validations?.additionalTriggers || null

    const initServiceEvent = createEvent('initServiceEvent')
    const runMutationsOnUserActionsEvent = createEvent<RunMutationsOnUserActionsPayload>('runMutationsOnUserActionsEvent')

    const componentsModel = createComponentsModel({ themeService })

    const visabilityComponentsModel = createVisabilityComponentsModel({ componentsModel })

    const componentsValidationErrorsModel = createComponentsValidationErrorsModel({ visabilityComponentsModel })

    const depsOfRulesModel = createDepsOfRulesModel({
        appErrorsService,
        themeService,
        viewsService,
        schemaService,
        initialComponentsSchemas: initial,
    })

    const readyConditionalValidationRulesModel = createReadyConditionalValidationRulesModel({
        depsOfRulesModel,
        componentsModel,
        themeService,
        schemaService,
    })

    componentsModel.initEvent(
        createComponentsModels({
            runMutationsEvent: runMutationsOnUserActionsEvent,
            componentsModel,
            readyConditionalValidationRulesModel,
            componentsValidationErrorsModel,
            themeService,
            initialComponentsSchemas: initial,
            additionalTriggers,
        }),
    )

    const formValidationModel = createFormValidationModel({
        componentsModel,
        visabilityComponentsModel,
        componentsValidationErrorsModel,
        readyConditionalValidationRulesModel,
        themeService,
        schemaService,
    })

    const mutationsRulesModel = createMutationsRulesModel({
        componentsModel,
        visabilityComponentsModel,
        themeService,
        schemaService,
    })

    const changeViewsModel = createChangeViewsModel({
        componentsModel,
        depsOfRulesModel,
        viewsService,
    })

    init({
        viewsService,
        componentsModel,
        visabilityComponentsModel,
        componentsValidationErrorsModel,
        depsOfRulesModel,
        readyConditionalValidationRulesModel,
        formValidationModel,
        mutationsRulesModel,
        changeViewsModel,
        initServiceEvent,
        runMutationsOnUserActionsEvent,
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
        visabilityComponentsModel,
        formValidationModel,
        initServiceEvent,
        updateComponentsSchemasEvent,
        removeComponentsSchemasByIdsEvent,
    }
}
