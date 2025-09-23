import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents } from 'patronum'

import { ViewsService } from '../views'
import { ChangeViewsModel } from './models/change-views-model'
import { ComponentsModel } from './models/components-model'
import { ComponentsValidationErrorsModel } from './models/components-validation-errors-model'
import { DepsOfRulesModel } from './models/deps-of-rules-model'
import { FormValidationModel } from './models/form-validation-model'
import { MutationsRulesModel } from './models/mutations-rules-model'
import { ReadyConditionalValidationRulesModel } from './models/ready-conditional-validation-rules-model'
import { VisabilityComponentsModel } from './models/visability-components-model'
import { RunMutationsOnUserActionsPayload } from './types'

type Params = {
    viewsService: ViewsService
    componentsModel: ComponentsModel
    visabilityComponentsModel: VisabilityComponentsModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationRulesModel: ReadyConditionalValidationRulesModel
    formValidationModel: FormValidationModel
    mutationsRulesModel: MutationsRulesModel
    changeViewsModel: ChangeViewsModel
    initServiceEvent: EventCallable<void>
    runMutationsOnUserActionsEvent: EventCallable<RunMutationsOnUserActionsPayload>
}

export const init = ({
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
}: Params) => {
    // проверка смены вью
    // вычисл. готовых валидаций
    // дальше обычные шаги (только без запуска проверки view) - запуск мутаций (для всего текущего view) и просчёт готовых валидаций

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
        target: mutationsRulesModel.calcMutationsEvent,
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
        target: mutationsRulesModel.calcMutationsEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfCalcMutationsEvent,
        fn: ({ componentsToUpdate, newComponentsSchemas }) => ({
            componentsToUpdate,
            newComponentsSchemas,
        }),
        target: readyConditionalValidationRulesModel.calcReadyRulesEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfCalcMutationsEvent,
        fn: ({ hiddenComponentsIds }) => hiddenComponentsIds,
        target: visabilityComponentsModel.setHiddenComponentsIdsEvent,
    })

    sample({
        clock: mutationsRulesModel.resultOfCalcMutationsEvent,
        fn: ({ componentsToUpdate }) => componentsToUpdate,
        target: componentsModel.updateModelsFx,
    })

    sample({
        clock: mutationsRulesModel.componentsIsUpdatedAfterMutationsEvent,
        // filter: if init active -> exit
        fn: ({ componentsToUpdate }) => ({ componentsToUpdate }),
        target: changeViewsModel.runViewChangeCheckEvent,
    })

    // init false

    // нужно сделать sample/combine которйы будет говорить что init false
    // изначально какой-то стор true, и если он true и мы получили componentsIsUpdatedAfterMutationsEvent - false
    // componentsIsUpdatedAfterMutationsEvent разместить под sample выше

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            depsForAllMutationResolution: depsOfRulesModel.$depsForAllMutationResolution,
        },
        clock: changeViewsModel.canBeChangeViewEvent,
        // filter: if init active -> exit
        fn: ({ componentsSchemas, depsForAllMutationResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationResolution: depsForAllMutationResolution,
        }),
        target: mutationsRulesModel.calcMutationsEvent,
    })
}
