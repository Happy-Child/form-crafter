import { ComponentsValidationErrorsModel, ReadyConditionalValidationsModel, RunMutationsOnUserActionPayload } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample, StoreWritable } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents, once } from 'patronum'

import { ViewsService } from '../../views'
import { ChangeViewsModel } from '../models/change-views-model'
import { ComponentsCreatorModel } from '../models/components-creator-model'
import { ComponentsGeneralModel } from '../models/components-general-model'
import { ComponentsRegistryModel } from '../models/components-registry-model'
import { DepsOfRulesModel } from '../models/deps-of-rules-model'
import { FormValidationModel } from '../models/form-validation-model'
import { MutationsModel } from '../models/mutations-model'
import { RepeaterModel } from '../models/repeater-model'
import { initComponents } from './components'
import { initChangeViews } from './init-change-views'

type Params = {
    runMutationsOnUserAction: EventCallable<RunMutationsOnUserActionPayload>
    viewsService: ViewsService
    componentsRegistryModel: ComponentsRegistryModel
    componentsGeneralModel: ComponentsGeneralModel
    componentsCreatorModel: ComponentsCreatorModel
    repeaterModel: RepeaterModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
    formValidationModel: FormValidationModel
    mutationsModel: MutationsModel
    changeViewsModel: ChangeViewsModel
    startInit: EventCallable<void>
    $firstMutationsIsDone: StoreWritable<boolean>
    setFirstMutationsToDone: EventCallable<void>
}

export const init = ({
    runMutationsOnUserAction,
    viewsService,
    componentsRegistryModel,
    componentsGeneralModel,
    componentsCreatorModel,
    repeaterModel,
    componentsValidationErrorsModel,
    depsOfRulesModel,
    readyConditionalValidationsModel,
    formValidationModel,
    mutationsModel,
    changeViewsModel,
    startInit,
    setFirstMutationsToDone,
}: Params) => {
    initComponents({
        viewsService,
        repeaterModel,
        componentsRegistryModel,
        componentsCreatorModel,
    })

    // ПОХОДУ НУЖНО РЯДОМ С viewCanBeChanged писать(((
    sample({
        clock: changeViewsModel.viewCanBeChanged,
        fn: ({ viewId }) => viewId,
        target: [viewsService.setCurrentViewId, componentsValidationErrorsModel.removeAllErrors, formValidationModel.groupValidationModel.clearErrors],
    })

    sample({
        source: {
            componentsSchemas: componentsRegistryModel.$componentsSchemas,
        },
        clock: startInit,
        fn: ({ componentsSchemas }) => ({
            componentsToUpdate: Object.entries(componentsSchemas).map(([componentId, schema]) => ({ componentId, schema, isNewValue: true })),
        }),
        target: changeViewsModel.runViewChangeCheck,
    })

    sample({
        source: {
            componentsSchemas: componentsRegistryModel.$componentsSchemas,
        },
        clock: startInit,
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
            componentsSchemas: componentsRegistryModel.$componentsSchemas,
            activeViewDepsForAllMutationsResolution: depsOfRulesModel.$activeViewDepsForAllMutationsResolution,
        },
        clock: combineEvents([startInit, readyConditionalValidationsModel.resultOfCalcReadyValidations]),
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
            componentsSchemas: componentsRegistryModel.$componentsSchemas,
            activeViewDepsGraphForMutationsResolution: depsOfRulesModel.$activeViewDepsGraphForMutationsResolution,
        },
        clock: runMutationsOnUserAction,
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
        target: componentsGeneralModel.setHiddenComponents,
    })

    sample({
        clock: mutationsModel.resultOfCalcMutations,
        filter: ({ componentsToUpdate }) => isNotEmpty(componentsToUpdate),
        fn: ({ componentsToUpdate }) => componentsToUpdate,
        target: componentsRegistryModel.updateComponentsModelsFx,
    })

    sample({
        clock: once(mutationsModel.resultOfCalcMutations),
        target: setFirstMutationsToDone,
    })

    initChangeViews({
        componentsRegistryModel,
        depsOfRulesModel,
        mutationsModel,
        changeViewsModel,
    })
}
