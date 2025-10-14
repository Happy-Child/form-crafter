import { EntityId } from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, split, StoreWritable } from 'effector'
import { combineEvents } from 'patronum'

import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { MutationsModel } from '../mutations-model'
import { PrepareDispatcherPayload } from './types'

type Params = {
    viewsService: ViewsService
    componentsModel: ComponentsModel
    depsOfRulesModel: DepsOfRulesModel
    mutationsModel: MutationsModel
    $firstMutationsIsDone: StoreWritable<boolean>
}

export type ChangeViewsModel = ReturnType<typeof createChangeViewsModel>

export const createChangeViewsModel = ({ viewsService, componentsModel, depsOfRulesModel, mutationsModel, $firstMutationsIsDone }: Params) => {
    const $changeViewWasChecked = createStore(false)

    const runViewChangeCheck = createEvent<PrepareDispatcherPayload>('prepareDispatcherEvent')

    const setChangeViewWasChecked = createEvent<boolean>('setChangeViewWasChecked')
    const resetChangeViewWasChecked = createEvent('resetChangeViewWasChecked')

    const startViewChangeCheck = createEvent('startViewChangeCheck')

    const calcMutationsAfterViewChanged = createEvent('calcMutationsAfterViewChanged')

    $changeViewWasChecked.on(setChangeViewWasChecked, (_, value) => value)
    $changeViewWasChecked.on(startViewChangeCheck, () => true)
    $changeViewWasChecked.reset(resetChangeViewWasChecked)

    const resultOfViewChangeCheck = sample({
        source: {
            getIsConditionSuccessfulChecker: componentsModel.$getIsConditionSuccessfulChecker,
            viewsConditionsDeps: depsOfRulesModel.$viewsConditionsDeps,
            viewsConditionsAllDeps: depsOfRulesModel.$viewsConditionsAllDeps,
            additionalsViews: viewsService.$additionalsViews,
            curentViewId: viewsService.$curentViewId,
        },
        clock: runViewChangeCheck,
        fn: ({ getIsConditionSuccessfulChecker, viewsConditionsDeps, viewsConditionsAllDeps, additionalsViews, curentViewId }, { componentsToUpdate }) => {
            if (!isNotEmpty(additionalsViews)) {
                return { canBeChange: false }
            }

            const someComponentIsChanged = componentsToUpdate.some(({ isNewValue }) => !!isNewValue)
            if (!someComponentIsChanged) {
                return { canBeChange: false }
            }

            const componentsToUpdateSet = new Set(componentsToUpdate.map(({ componentId }) => componentId))
            const someDepsIsChanged = Array.from(viewsConditionsAllDeps).some((depId) => componentsToUpdateSet.has(depId))
            if (!someDepsIsChanged) {
                return { canBeChange: false }
            }

            let newViewId: EntityId | null = null

            const isConditionSuccessfulChecker = getIsConditionSuccessfulChecker()

            for (const view of additionalsViews) {
                const deps = viewsConditionsDeps.viewIdToDepsComponents[view.id]

                if (!isNotEmpty(deps)) {
                    continue
                }

                const canBeApplyView = isConditionSuccessfulChecker({ condition: view.condition })
                if (canBeApplyView) {
                    newViewId = view.id
                    break
                }
            }

            const isNewView = curentViewId !== newViewId

            return { canBeChange: isNewView, viewId: newViewId }
        },
    })

    type FilteredParams = { canBeChange: boolean; viewId: EntityId | null }

    sample({
        clock: resultOfViewChangeCheck,
        filter: (params): params is FilteredParams => params.canBeChange,
        fn: ({ viewId }: FilteredParams) => viewId,
        target: viewsService.setCurrentViewIdEvent,
    })

    const splitDispatcher = sample({
        source: { firstMutationsIsDone: $firstMutationsIsDone },
        clock: resultOfViewChangeCheck,
        filter: ({ firstMutationsIsDone }) => firstMutationsIsDone,
        fn: (_, params) => params,
    })

    split({
        source: splitDispatcher,
        match: {
            reset: ({ canBeChange }) => !canBeChange,
        },
        cases: {
            reset: resetChangeViewWasChecked,
            __: calcMutationsAfterViewChanged,
        },
    })

    sample({
        clock: mutationsModel.resultOfCalcMutationsEvent,
        filter: ({ componentsToUpdate }) => isEmpty(componentsToUpdate),
        target: resetChangeViewWasChecked,
    })

    const checkChangeViewDispatcher = sample({
        source: { changeViewWasChecked: $changeViewWasChecked },
        clock: mutationsModel.componentsIsUpdatedAfterMutationsEvent,
        fn: (source, params) => ({ ...source, ...params }),
    })

    split({
        source: checkChangeViewDispatcher,
        match: {
            reset: ({ changeViewWasChecked }) => changeViewWasChecked,
        },
        cases: {
            reset: resetChangeViewWasChecked,
            __: startViewChangeCheck,
        },
    })

    sample({
        clock: combineEvents([mutationsModel.componentsIsUpdatedAfterMutationsEvent, startViewChangeCheck]),
        fn: ([{ componentsToUpdate }]) => ({ componentsToUpdate }),
        target: runViewChangeCheck,
    })

    // TODO MOVE_TO_INIT - вынести mutationsModel. Сделать наружу апи которую будет дёргать mutationsModel с отдельном init-change-view.ts файле.
    sample({
        source: {
            componentsSchemas: componentsModel.$componentsSchemas,
            activeViewDepsForAllMutationsResolution: depsOfRulesModel.$activeViewDepsForAllMutationsResolution,
        },
        clock: calcMutationsAfterViewChanged,
        fn: ({ componentsSchemas, activeViewDepsForAllMutationsResolution }) => ({
            curComponentsSchemas: componentsSchemas,
            newComponentsSchemas: componentsSchemas,
            componentsIdsToUpdate: [],
            depsForMutationsResolution: activeViewDepsForAllMutationsResolution,
        }),
        target: mutationsModel.calcMutationsEvent,
    })

    return {
        runViewChangeCheck,
        resultOfViewChangeCheck,
        calcMutationsAfterViewChanged,
        setChangeViewWasChecked,
        resetChangeViewWasChecked,
        $changeViewWasChecked,
    }
}
