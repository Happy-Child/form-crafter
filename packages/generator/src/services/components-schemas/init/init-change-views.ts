import { isEmpty } from '@form-crafter/utils'
import { sample, split } from 'effector'
import { combineEvents } from 'patronum'

import { ChangeViewsModel } from '../models/change-views-model'
import { ComponentsModel } from '../models/components-model'
import { DepsOfRulesModel } from '../models/deps-of-rules-model'
import { MutationsModel } from '../models/mutations-model'

type Params = {
    componentsModel: ComponentsModel
    depsOfRulesModel: DepsOfRulesModel
    mutationsModel: MutationsModel
    changeViewsModel: ChangeViewsModel
}

export const initChangeViews = ({ componentsModel, depsOfRulesModel, mutationsModel, changeViewsModel }: Params) => {
    sample({
        clock: mutationsModel.resultOfCalcMutationsEvent,
        filter: ({ componentsToUpdate }) => isEmpty(componentsToUpdate),
        target: changeViewsModel.resetChangeViewWasChecked,
    })

    const checkChangeViewDispatcher = sample({
        source: { changeViewWasChecked: changeViewsModel.$changeViewWasChecked },
        clock: mutationsModel.componentsIsUpdatedAfterMutationsEvent,
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
        clock: combineEvents([mutationsModel.componentsIsUpdatedAfterMutationsEvent, changeViewsModel.startViewChangeCheck]),
        fn: ([{ componentsToUpdate }]) => ({ componentsToUpdate }),
        target: changeViewsModel.runViewChangeCheck,
    })

    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            activeViewDepsForAllMutationsResolution: depsOfRulesModel.$activeViewDepsForAllMutationsResolution,
        },
        clock: changeViewsModel.calcMutationsAfterViewChanged,
        fn: ({ componentsSchemas, activeViewDepsForAllMutationsResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationsResolution: activeViewDepsForAllMutationsResolution,
        }),
        target: mutationsModel.calcMutationsEvent,
    })
}
