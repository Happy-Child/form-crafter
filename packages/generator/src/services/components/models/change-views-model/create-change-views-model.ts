import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, split, StoreWritable } from 'effector'

import { ViewsService } from '../../../views'
import { ComponentsRegistryModel } from '../components-registry-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { PrepareDispatcherPayload } from './types'

type Params = {
    viewsService: Pick<ViewsService, '$additionalViewsConditions' | '$currentViewId'>
    componentsRegistryModel: Pick<ComponentsRegistryModel, '$getIsConditionSuccessfulChecker'>
    depsOfRulesModel: Pick<DepsOfRulesModel, '$viewsConditionsDeps' | '$viewsConditionsAllDeps'>
    $firstMutationsIsDone: StoreWritable<boolean>
}

export type ChangeViewsModel = ReturnType<typeof createChangeViewsModel>

export const createChangeViewsModel = ({ viewsService, componentsRegistryModel, depsOfRulesModel, $firstMutationsIsDone }: Params) => {
    const $changeViewWasChecked = createStore(false)

    const runViewChangeCheck = createEvent<PrepareDispatcherPayload>('runViewChangeCheck')

    const setChangeViewWasChecked = createEvent<boolean>('setChangeViewWasChecked')
    const resetChangeViewWasChecked = createEvent('resetChangeViewWasChecked')

    const startViewChangeCheck = createEvent('startViewChangeCheck')

    const calcMutationsAfterViewChanged = createEvent('calcMutationsAfterViewChanged')

    $changeViewWasChecked.on(setChangeViewWasChecked, (_, value) => value)
    $changeViewWasChecked.on(startViewChangeCheck, () => true)
    $changeViewWasChecked.reset(resetChangeViewWasChecked)

    const resultOfViewChangeCheck = sample({
        source: {
            getIsConditionSuccessfulChecker: componentsRegistryModel.$getIsConditionSuccessfulChecker,
            viewsConditionsDeps: depsOfRulesModel.$viewsConditionsDeps,
            viewsConditionsAllDeps: depsOfRulesModel.$viewsConditionsAllDeps,
            additionalViewsConditions: viewsService.$additionalViewsConditions,
            currentViewId: viewsService.$currentViewId,
        },
        clock: runViewChangeCheck,
        fn: (
            { getIsConditionSuccessfulChecker, viewsConditionsDeps, viewsConditionsAllDeps, additionalViewsConditions, currentViewId },
            { componentsToUpdate },
        ) => {
            if (!isNotEmpty(additionalViewsConditions)) {
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

            for (const { id: viewId, condition } of additionalViewsConditions) {
                const deps = viewsConditionsDeps.viewIdToDepsComponents[viewId]

                if (!isNotEmpty(deps)) {
                    continue
                }

                const canBeApplyView = isConditionSuccessfulChecker({ condition: condition })
                if (canBeApplyView) {
                    newViewId = viewId
                    break
                }
            }

            const isNewView = currentViewId !== newViewId

            return { canBeChange: isNewView, viewId: newViewId }
        },
    })

    type FilteredParams = { canBeChange: boolean; viewId: EntityId | null }
    const viewCanBeChanged = sample({
        clock: resultOfViewChangeCheck,
        filter: (params): params is FilteredParams => params.canBeChange,
        fn: (params: FilteredParams) => params,
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

    return {
        runViewChangeCheck,
        viewCanBeChanged,
        resultOfViewChangeCheck,
        calcMutationsAfterViewChanged,
        setChangeViewWasChecked,
        resetChangeViewWasChecked,
        startViewChangeCheck,
        $changeViewWasChecked,
    }
}
