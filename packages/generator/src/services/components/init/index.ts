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
import { RepeaterModel } from '../models/repeater-model'
import { RunMutationsOnUserActionsPayload } from '../types'
import { initChangeViews } from './init-change-views'

type Params = {
    viewsService: ViewsService
    componentsModel: ComponentsModel
    repeaterModel: RepeaterModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
    formValidationModel: FormValidationModel
    mutationsModel: MutationsModel
    changeViewsModel: ChangeViewsModel
    initService: EventCallable<void>
    $firstMutationsIsDone: StoreWritable<boolean>
    runMutationsOnUserActions: EventCallable<RunMutationsOnUserActionsPayload>
    setFirstMutationsToDone: EventCallable<void>
}

export const init = ({
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
    runMutationsOnUserActions,
    setFirstMutationsToDone,
}: Params) => {
    // Выснести мутации service.setCurrentViewId наружу
    sample({
        clock: changeViewsModel.viewCanBeChanged,
        fn: ({ viewId }) => viewId,
        target: [viewsService.setCurrentViewId, componentsValidationErrorsModel.removeAllErrors, formValidationModel.groupValidationModel.clearErrors],
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
        },
        clock: initService,
        fn: ({ componentsSchemas }) => ({
            componentsToUpdate: Object.entries(componentsSchemas).map(([componentId, schema]) => ({ componentId, schema, isNewValue: true })),
        }),
        target: changeViewsModel.runViewChangeCheck,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
        },
        clock: initService,
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
        target: [componentsValidationErrorsModel.filterAllErrors, formValidationModel.groupValidationModel.filterErrors],
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            activeViewDepsForAllMutationsResolution: depsOfRulesModel.$activeViewDepsForAllMutationsResolution,
        },
        clock: combineEvents([initService, readyConditionalValidationsModel.resultOfCalcReadyValidations]),
        fn: ({ componentsSchemas, activeViewDepsForAllMutationsResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationsResolution: activeViewDepsForAllMutationsResolution,
        }),
        target: mutationsModel.calcMutations,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            activeViewDepsGraphForMutationsResolution: depsOfRulesModel.$activeViewDepsGraphForMutationsResolution,
        },
        clock: runMutationsOnUserActions,
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
        target: mutationsModel.calcMutations,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutations,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ componentsToUpdate, newComponentsSchemas }) => ({
            componentsToUpdate,
            newComponentsSchemas,
        }),
        target: readyConditionalValidationsModel.calcReadyValidations,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutations,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ hiddenComponents }) => hiddenComponents,
        target: componentsModel.setHiddenComponents,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutations,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ componentsToUpdate }) => componentsToUpdate,
        target: componentsModel.updateModelsFx,
    })

    sample({
        clock: once(mutationsModel.resultOfCalcMutations),
        target: setFirstMutationsToDone,
    })

    initChangeViews({
        componentsModel,
        depsOfRulesModel,
        mutationsModel,
        changeViewsModel,
    })

    // sample repeaterModel
}
