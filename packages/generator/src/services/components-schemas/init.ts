import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents } from 'patronum'

import { ChangeViewsModel } from './models/change-views-model'
import { ComponentsModel } from './models/components-model'
import { ComponentsValidationErrorsModel } from './models/components-validation-errors-model'
import { DepsOfRulesModel } from './models/deps-of-rules-model'
import { FormValidationModel } from './models/form-validation-model'
import { MutationsRulesModel } from './models/mutations-rules-model'
import { ReadyConditionalValidationRulesModel } from './models/ready-conditional-validation-rules-model'
import { VisabilityComponentsModel } from './models/visability-components-model'
import { RunMutationsRulesOnUserActionsPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationRulesModel: ReadyConditionalValidationRulesModel
    formValidationModel: FormValidationModel
    mutationsRulesModel: MutationsRulesModel
    changeViewsModel: ChangeViewsModel
    initServiceEvent: EventCallable<void>
    runMutationsRulesOnUserActionsEvent: EventCallable<RunMutationsRulesOnUserActionsPayload>
}

export const init = ({
    componentsModel,
    visabilityComponentsModel,
    componentsValidationErrorsModel,
    depsOfRulesModel,
    readyConditionalValidationRulesModel,
    formValidationModel,
    mutationsRulesModel,
    changeViewsModel,
    initServiceEvent,
    runMutationsRulesOnUserActionsEvent,
}: Params) => {
    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
        },
        clock: initServiceEvent,
        fn: ({ componentsSchemas }) => ({
            componentsToUpdate: Object.entries(componentsSchemas).map(([componentId, schema]) => ({ componentId, schema, isNewValue: true })),
            skipIfValueUnchanged: false,
        }),
        // TODO вычислять для всех компонентов в рамках всех view? Или только текущей?
        // будет понятно и очевидно вычисляя только на текущей
        target: readyConditionalValidationRulesModel.calcReadyRulesEvent,
    })

    // TODO тут тоже вьебать нужно выполнение активного view, как и с готовыми валидац.

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            depsGraphForMutationResolution: depsOfRulesModel.$depsGraphForMutationResolution,
        },
        clock: runMutationsRulesOnUserActionsEvent,
        fn: ({ componentsSchemas, depsGraphForMutationResolution }, { id: componentIdToUpdate, data: propertiesToUpdate }) => {
            const finalComponentsSchemas = cloneDeep(componentsSchemas)
            finalComponentsSchemas[componentIdToUpdate].properties = {
                ...finalComponentsSchemas[componentIdToUpdate].properties,
                ...propertiesToUpdate,
            }

            const depsForMutationResolution = depsGraphForMutationResolution[componentIdToUpdate] || []

            return {
                curComponentsSchemas: componentsSchemas,
                newComponentsSchemas: finalComponentsSchemas,
                componentsIdsToUpdate: [componentIdToUpdate],
                depsForMutationResolution,
            }
        },
        target: mutationsRulesModel.runMutationRulesEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
        fn: ({ componentsToUpdate }) => ({
            componentsToUpdate,
        }),
        target: readyConditionalValidationRulesModel.calcReadyRulesEvent,
    })

    sample({
        clock: readyConditionalValidationRulesModel.resultOfCalcReadyRulesEvent,
        filter: ({ rulesToInactive }) => isNotEmpty(rulesToInactive),
        fn: ({ rulesToInactive }) => rulesToInactive,
        target: [componentsValidationErrorsModel.filterAllErrorsEvent, formValidationModel.groupValidationModel.filterErrorsEvent],
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            depsForAllMutationResolution: depsOfRulesModel.$depsForAllMutationResolution,
        },
        clock: combineEvents([initServiceEvent, readyConditionalValidationRulesModel.resultOfCalcReadyRulesEvent]),
        fn: ({ componentsSchemas, depsForAllMutationResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationResolution: depsForAllMutationResolution,
        }),
        target: mutationsRulesModel.runMutationRulesEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
        fn: ({ componentsToUpdate }) => componentsToUpdate,
        target: componentsModel.updateModelsFx,
    })

    sample({
        clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
        fn: ({ rulesOverridesCacheToUpdate }) => rulesOverridesCacheToUpdate,
        target: mutationsRulesModel.setRulesOverridesCacheEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
        fn: ({ hiddenComponentsIds }) => hiddenComponentsIds,
        target: visabilityComponentsModel.setHiddenComponentsIdsEvent,
    })

    // sample({
    //     clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
    //     target: changeViewsModel...,
    // })
}
