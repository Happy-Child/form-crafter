import { ComponentsValidationErrorsModel, EntityId, ReadyConditionalValidationsModel, RunMutationsOnUserActionPayload } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { EventCallable, sample, StoreWritable } from 'effector'
import { cloneDeep } from 'lodash-es'
import { combineEvents, once } from 'patronum'

import { ChangeViewsModel } from '../models/change-views-model'
import { ComponentsCreatorModel } from '../models/components-creator-model'
import { ComponentsGeneralModel } from '../models/components-general-model'
import { ComponentsRegistryModel } from '../models/components-registry-model'
import { DepsOfRulesModel } from '../models/deps-of-rules-model'
import { FormValidationModel } from '../models/form-validation-model'
import { MutationsModel } from '../models/mutations-model'
import { initChangeViews } from './init-change-views'
import { initComponents } from './init-components'

type Params = {
    runMutationsOnUserAction: EventCallable<RunMutationsOnUserActionPayload>
    clearComponentsData: EventCallable<Set<EntityId>>
    startInit: EventCallable<void>
    componentsRegistryModel: ComponentsRegistryModel
    componentsGeneralModel: ComponentsGeneralModel
    componentsCreatorModel: ComponentsCreatorModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    depsOfRulesModel: DepsOfRulesModel
    readyConditionalValidationsModel: ReadyConditionalValidationsModel
    formValidationModel: FormValidationModel
    mutationsModel: MutationsModel
    changeViewsModel: ChangeViewsModel
    $firstMutationsIsDone: StoreWritable<boolean>
    setFirstMutationsToDone: EventCallable<void>
}

export const init = ({
    runMutationsOnUserAction,
    clearComponentsData,
    startInit,
    componentsRegistryModel,
    componentsGeneralModel,
    componentsCreatorModel,
    componentsValidationErrorsModel,
    depsOfRulesModel,
    readyConditionalValidationsModel,
    formValidationModel,
    mutationsModel,
    changeViewsModel,
    setFirstMutationsToDone,
}: Params) => {
    sample({
        clock: readyConditionalValidationsModel.resultOfCalcReadyValidations,
        filter: ({ rulesToInactive }) => isNotEmpty(rulesToInactive),
        fn: ({ rulesToInactive }) => rulesToInactive,
        target: [componentsValidationErrorsModel.filterAllErrors, formValidationModel.groupValidationModel.filterErrors],
    })

    initComponents({
        clearComponentsData,
        componentsRegistryModel,
        componentsCreatorModel,
        componentsValidationErrorsModel,
        readyConditionalValidationsModel,
    })

    sample({
        source: {
            componentsSchemas: componentsRegistryModel.componentsStoreModel.$componentsSchemas,
        },
        clock: startInit,
        fn: ({ componentsSchemas }) => ({
            componentsToUpdate: Object.entries(componentsSchemas).map(([componentId, schema]) => ({ componentId, schema, isNewValue: true })),
        }),
        target: changeViewsModel.runViewChangeCheck,
    })

    sample({
        source: {
            componentsSchemas: componentsRegistryModel.componentsStoreModel.$componentsSchemas,
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
        source: {
            componentsSchemas: componentsRegistryModel.componentsStoreModel.$componentsSchemas,
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
            componentsSchemas: componentsRegistryModel.componentsStoreModel.$componentsSchemas,
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
        target: componentsRegistryModel.componentsStoreModel.updateComponentsModelsFx,
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
        componentsValidationErrorsModel,
        formValidationModel,
    })
}
