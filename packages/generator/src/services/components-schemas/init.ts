import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample, StoreWritable } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents, once } from 'patronum'

import { ViewsService } from '../views'
import { ChangeViewsModel } from './models/change-views-model'
import { ComponentsModel } from './models/components-model'
import { ComponentsValidationErrorsModel } from './models/components-validation-errors-model'
import { DepsOfRulesModel } from './models/deps-of-rules-model'
import { FormValidationModel } from './models/form-validation-model'
import { MutationsModel } from './models/mutations-model'
import { ReadyConditionalValidationsModel } from './models/ready-conditional-validations-model'
import { VisabilityComponentsModel } from './models/visability-components-model'
import { RunMutationsOnUserActionsPayload } from './types'

type Params = {
    viewsService: ViewsService
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
    formValidationModel: FormValidationModel
    mutationsModel: MutationsModel
    changeViewsModel: ChangeViewsModel
    initServiceEvent: EventCallable<void>
    $firstMutationsIsDone: StoreWritable<boolean>
    runMutationsOnUserActionsEvent: EventCallable<RunMutationsOnUserActionsPayload>
    setFirstMutationsToDone: EventCallable<void>
}

export const init = ({
    componentsModel,
    visabilityComponentsModel,
    componentsValidationErrorsModel,
    depsOfRulesModel,
    readyConditionalValidationsModel,
    formValidationModel,
    mutationsModel,
    changeViewsModel,
    initServiceEvent,
    runMutationsOnUserActionsEvent,
    setFirstMutationsToDone,
}: Params) => {
    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
        },
        clock: initServiceEvent,
        fn: ({ componentsSchemas }) => ({
            componentsToUpdate: Object.entries(componentsSchemas).map(([componentId, schema]) => ({ componentId, schema, isNewValue: true })),
        }),
        target: changeViewsModel.runViewChangeCheck,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
        },
        clock: initServiceEvent,
        fn: ({ componentsSchemas }) => ({
            componentsToUpdate: Object.entries(componentsSchemas).map(([componentId, schema]) => ({ componentId, schema, isNewValue: true })),
            newComponentsSchemas: componentsSchemas,
            skipIfValueUnchanged: false,
        }),
        target: readyConditionalValidationsModel.calcReadyRulesEvent,
    })

    sample({
        clock: readyConditionalValidationsModel.resultOfCalcReadyRulesEvent,
        filter: ({ rulesToInactive }) => isNotEmpty(rulesToInactive),
        fn: ({ rulesToInactive }) => rulesToInactive,
        target: [componentsValidationErrorsModel.filterAllErrorsEvent, formValidationModel.groupValidationModel.filterErrorsEvent],
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            depsForAllMutationResolution: depsOfRulesModel.$depsForAllMutationResolution,
        },
        clock: combineEvents([initServiceEvent, readyConditionalValidationsModel.resultOfCalcReadyRulesEvent]),
        fn: ({ componentsSchemas, depsForAllMutationResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationResolution: depsForAllMutationResolution,
        }),
        target: mutationsModel.calcMutationsEvent,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            depsGraphForMutationResolution: depsOfRulesModel.$depsGraphForMutationResolution,
        },
        clock: runMutationsOnUserActionsEvent,
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
        target: mutationsModel.calcMutationsEvent,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutationsEvent,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ componentsToUpdate, newComponentsSchemas }) => ({
            componentsToUpdate,
            newComponentsSchemas,
        }),
        target: readyConditionalValidationsModel.calcReadyRulesEvent,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutationsEvent,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ hiddenComponentsIds }) => hiddenComponentsIds,
        target: visabilityComponentsModel.setHiddenComponentsIdsEvent,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutationsEvent,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ componentsToUpdate }) => componentsToUpdate,
        target: componentsModel.updateModelsFx,
    })

    sample({
        clock: once(mutationsModel.resultOfCalcMutationsEvent),
        target: setFirstMutationsToDone,
    })
}
