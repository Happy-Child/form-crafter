import { isEmpty } from '@form-crafter/utils'
import { sample, split } from 'effector'
import { combineEvents } from 'patronum'

import { ChangeViewsModel } from '../models/change-views-model'
import { ComponentsRegistryModel } from '../models/components-registry-model'
import { DepsOfRulesModel } from '../models/deps-of-rules-model'
import { MutationsModel } from '../models/mutations-model'

type Params = {
    componentsRegistryModel: ComponentsRegistryModel
    depsOfRulesModel: DepsOfRulesModel
    mutationsModel: MutationsModel
    changeViewsModel: ChangeViewsModel
}

export const initChangeViews = ({ componentsRegistryModel, depsOfRulesModel, mutationsModel, changeViewsModel }: Params) => {
    sample({
        clock: mutationsModel.resultOfCalcMutations,
        filter: ({ componentsToUpdate }) => isEmpty(componentsToUpdate),
        target: changeViewsModel.resetChangeViewWasChecked,
    })

    const checkChangeViewDispatcher = sample({
        source: { changeViewWasChecked: changeViewsModel.$changeViewWasChecked },
        clock: mutationsModel.componentsIsUpdatedAfterMutations,
        fn: (source, params) => ({ ...source, ...params }),
    })

    split({
        source: checkChangeViewDispatcher,
        match: {
            reset: ({ changeViewWasChecked }) => changeViewWasChecked,
        },
        cases: {
            reset: changeViewsModel.resetChangeViewWasChecked,
            __: changeViewsModel.startViewChangeCheck,
        },
    })

    sample({
        clock: combineEvents([mutationsModel.componentsIsUpdatedAfterMutations, changeViewsModel.startViewChangeCheck]),
        fn: ([{ componentsToUpdate }]) => ({ componentsToUpdate }),
        target: changeViewsModel.runViewChangeCheck,
    })

    sample({
        source: {
            componentsSchemas: componentsRegistryModel.$componentsSchemas,
            activeViewDepsForAllMutationsResolution: depsOfRulesModel.$activeViewDepsForAllMutationsResolution,
        },
        clock: changeViewsModel.calcMutationsAfterViewChanged,
        fn: ({ componentsSchemas, activeViewDepsForAllMutationsResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationsResolution: activeViewDepsForAllMutationsResolution,
        }),
        target: mutationsModel.calcMutations,
    })
}
