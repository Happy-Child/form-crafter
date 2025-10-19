import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample, StoreWritable } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents, once } from 'patronum'

import { ViewsService } from '../../views'
import { ChangeViewsModel } from '../models/change-views-model'
import { ComponentsModel } from '../models/components-model'
import { ComponentsValidationErrorsModel } from '../models/components-validation-errors-model'
import { DepsOfRulesModel } from '../models/deps-of-rules-model'
import { FormValidationModel } from '../models/form-validation-model'
import { MutationsModel } from '../models/mutations-model'
import { ReadyConditionalValidationsModel } from '../models/ready-conditional-validations-model'
import { RunMutationsOnUserActionsPayload } from '../types'
import { initChangeViews } from './init-change-views'

type Params = {
    viewsService: ViewsService
    componentsModel: ComponentsModel
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
    viewsService,
    componentsModel,
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
    type FilteredParams = { canBeChange: boolean; viewId: EntityId | null }
    sample({
        clock: changeViewsModel.resultOfViewChangeCheck,
        filter: (params): params is FilteredParams => params.canBeChange,
        fn: ({ viewId }: FilteredParams) => viewId,
        target: viewsService.setCurrentViewIdEvent,
    })

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
        target: readyConditionalValidationsModel.calcReadyValidations,
    })

    sample({
        clock: readyConditionalValidationsModel.resultOfCalcReadyValidations,
        filter: ({ rulesToInactive }) => isNotEmpty(rulesToInactive),
        fn: ({ rulesToInactive }) => rulesToInactive,
        target: [componentsValidationErrorsModel.filterAllErrorsEvent, formValidationModel.groupValidationModel.filterErrorsEvent],
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            activeViewDepsForAllMutationsResolution: depsOfRulesModel.$activeViewDepsForAllMutationsResolution,
        },
        clock: combineEvents([initServiceEvent, readyConditionalValidationsModel.resultOfCalcReadyValidations]),
        fn: ({ componentsSchemas, activeViewDepsForAllMutationsResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationsResolution: activeViewDepsForAllMutationsResolution,
        }),
        target: mutationsModel.calcMutationsEvent,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            activeViewDepsGraphForMutationsResolution: depsOfRulesModel.$activeViewDepsGraphForMutationsResolution,
        },
        clock: runMutationsOnUserActionsEvent,
        fn: ({ componentsSchemas, activeViewDepsGraphForMutationsResolution }, { id: componentIdToUpdate, data: propertiesToUpdate }) => {
            const finalComponentsSchemas = cloneDeep(componentsSchemas)
            finalComponentsSchemas[componentIdToUpdate].properties = {
                ...finalComponentsSchemas[componentIdToUpdate].properties,
                ...propertiesToUpdate,
            }

            const depsForMutationsResolution = activeViewDepsGraphForMutationsResolution[componentIdToUpdate] || []

            return {
                curComponentsSchemas: componentsSchemas,
                newComponentsSchemas: finalComponentsSchemas,
                componentsIdsToUpdate: [componentIdToUpdate],
                depsForMutationsResolution,
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
        target: readyConditionalValidationsModel.calcReadyValidations,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutationsEvent,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ hiddenComponents }) => hiddenComponents,
        target: componentsModel.setHiddenComponents,
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

    initChangeViews({
        componentsModel,
        depsOfRulesModel,
        mutationsModel,
        changeViewsModel,
    })
}
