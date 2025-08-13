import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents } from 'patronum'

import { ComponentsModel } from './models/components-model'
import { DepsOfRulesModel } from './models/deps-of-rules-model'
import { FormValidationModel } from './models/form-validation-model'
import { MutationsRulesModel } from './models/mutations-rules-model'
import { ReadyConditionalValidationRulesModel } from './models/ready-conditional-validation-rules-model'
import { ValidationsErrorsModel } from './models/validations-errors-model'
import { VisabilityComponentsModel } from './models/visability-components-model'
import { RunMutationsRulesOnUserActionsPayload } from './types'

type Params = {
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    validationsErrorsModel: ValidationsErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationRulesModel: ReadyConditionalValidationRulesModel
    formValidationModel: FormValidationModel
    mutationsRulesModel: MutationsRulesModel
    initServiceEvent: EventCallable<void>
    runMutationsRulesOnUserActionsEvent: EventCallable<RunMutationsRulesOnUserActionsPayload>
}

export const init = ({
    componentsModel,
    visabilityComponentsModel,
    validationsErrorsModel,
    depsOfRulesModel,
    readyConditionalValidationRulesModel,
    formValidationModel,
    mutationsRulesModel,
    initServiceEvent,
    runMutationsRulesOnUserActionsEvent,
}: Params) => {
    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
        },
        clock: initServiceEvent,
        fn: ({ componentsSchemas }) => ({
            componentsSchemasToUpdate: componentsSchemas,
            skipIfValueUnchanged: false,
        }),
        target: readyConditionalValidationRulesModel.calcReadyRulesEvent,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            sortedMutationsDependentsByComponent: depsOfRulesModel.$sortedMutationsDependentsByComponent,
        },
        clock: runMutationsRulesOnUserActionsEvent,
        fn: ({ componentsSchemas, sortedMutationsDependentsByComponent }, { id: componentIdToUpdate, data: propertiesToUpdate }) => {
            const finalComponentsSchemas = cloneDeep(componentsSchemas)
            finalComponentsSchemas[componentIdToUpdate].properties = {
                ...finalComponentsSchemas[componentIdToUpdate].properties,
                ...propertiesToUpdate,
            }

            const mutationsDependents = sortedMutationsDependentsByComponent[componentIdToUpdate] || []

            return {
                curComponentsSchemas: componentsSchemas,
                newComponentsSchemas: finalComponentsSchemas,
                componentsIdsToUpdate: [componentIdToUpdate],
                mutationsDependents,
            }
        },
        target: mutationsRulesModel.runMutationRulesEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
        fn: ({ componentsSchemasToUpdate }) => ({
            componentsSchemasToUpdate,
        }),
        target: readyConditionalValidationRulesModel.calcReadyRulesEvent,
    })

    sample({
        clock: readyConditionalValidationRulesModel.resultOfCalcReadyRulesEvent,
        filter: ({ rulesToInactive }) => isNotEmpty(rulesToInactive),
        fn: ({ rulesToInactive }) => rulesToInactive,
        target: [validationsErrorsModel.filterAllErrorsEvent, formValidationModel.groupValidationModel.filterErrorsEvent],
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            sortedAllMutationsDependents: depsOfRulesModel.$sortedAllMutationsDependents,
        },
        clock: combineEvents([initServiceEvent, readyConditionalValidationRulesModel.resultOfCalcReadyRulesEvent]),
        fn: ({ componentsSchemas, sortedAllMutationsDependents }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            mutationsDependents: sortedAllMutationsDependents,
        }),
        target: mutationsRulesModel.runMutationRulesEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfRunMutationRulesEvent,
        fn: ({ componentsSchemasToUpdate }) => componentsSchemasToUpdate,
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
}
