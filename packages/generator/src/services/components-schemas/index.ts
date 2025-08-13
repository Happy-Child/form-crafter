import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { createEvent } from 'effector'

import { init } from './init'
import { createComponentsModels } from './models/components'
import { createComponentsModel } from './models/components-model'
import { createDepsOfRulesModel } from './models/deps-of-rules-model'
import { createFormValidationModel } from './models/form-validation-model'
import { createMutationsRulesModel } from './models/mutations-rules-model'
import { createReadyConditionalValidationRulesModel } from './models/ready-conditional-validation-rules-model'
import { createValidationsErrorsModel } from './models/validations-errors-model'
import { createVisabilityComponentsModel } from './models/visability-components-model'
import { ComponentsSchemasService, ComponentsSchemasServiceParams, RunMutationsRulesOnUserActionsPayload } from './types'

export type { ComponentsSchemasService }

export const createComponentsSchemasService = ({ initial, themeService, schemaService }: ComponentsSchemasServiceParams): ComponentsSchemasService => {
    const additionalTriggers = schemaService.$schema.getState().validations?.additionalTriggers || null

    const initServiceEvent = createEvent('initServiceEvent')
    const runMutationsRulesOnUserActionsEvent = createEvent<RunMutationsRulesOnUserActionsPayload>('runMutationsRulesOnUserActionsEvent')

    const componentsModel = createComponentsModel()

    const visabilityComponentsModel = createVisabilityComponentsModel({ componentsModel })

    // cahnge to components validation errors model, только для компонентых ошибок
    const validationsErrorsModel = createValidationsErrorsModel({ visabilityComponentsModel })

    const depsOfRulesModel = createDepsOfRulesModel({
        themeService,
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
            runMutationsRulesEvent: runMutationsRulesOnUserActionsEvent,
            componentsModel,
            readyConditionalValidationRulesModel,
            validationsErrorsModel,
            themeService,
            initialComponentsSchemas: initial,
            additionalTriggers,
        }),
    )

    const formValidationModel = createFormValidationModel({
        componentsModel,
        visabilityComponentsModel,
        validationsErrorsModel,
        readyConditionalValidationRulesModel,
        themeService,
        schemaService,
    })

    const mutationsRulesModel = createMutationsRulesModel({
        componentsModel,
        depsOfRulesModel,
        visabilityComponentsModel,
        themeService,
        schemaService,
    })

    init({
        componentsModel,
        visabilityComponentsModel,
        validationsErrorsModel,
        depsOfRulesModel,
        readyConditionalValidationRulesModel,
        formValidationModel,
        mutationsRulesModel,
        initServiceEvent,
        runMutationsRulesOnUserActionsEvent,
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
        visabilityComponentsModel,
        validationsErrorsModel,
        formValidationModel,
        initServiceEvent,
        updateComponentsSchemasEvent,
        removeComponentsSchemasByIdsEvent,
    }
}
