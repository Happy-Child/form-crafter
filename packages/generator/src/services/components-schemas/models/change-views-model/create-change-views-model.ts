import { EntityId } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { createEvent, createStore, sample, split } from 'effector'

import { ViewsService } from '../../../views'
import { ComponentsModel } from '../components-model'
import { DepsOfRulesModel } from '../deps-of-rules-model'
import { PrepareDispatcherPayload } from './types'

type Params = {
    viewsService: ViewsService
    componentsModel: ComponentsModel
    depsOfRulesModel: DepsOfRulesModel
}

export type ChangeViewsModel = ReturnType<typeof createChangeViewsModel>

export const createChangeViewsModel = ({ viewsService, componentsModel, depsOfRulesModel }: Params) => {
    const $wasChecked = createStore(false)

    const runCalcNextViewEvent = createEvent('runCalcNextViewEvent')
    const guardForChangeViewEvent = createEvent<PrepareDispatcherPayload>('prepareDispatcherEvent')

    const setTrueWasCheckedEvent = createEvent('setTrueWasCheckedEvent')
    const setFalseWasCheckedEvent = createEvent('setFalseWasCheckedEvent')

    $wasChecked.on(setTrueWasCheckedEvent, () => true)
    $wasChecked.on(setFalseWasCheckedEvent, () => false)

    const dispatcherEvent = sample({
        source: { additionalsViews: viewsService.$additionalsViews, viewsConditionsAllDeps: depsOfRulesModel.$viewsConditionsAllDeps, wasChecked: $wasChecked },
        clock: guardForChangeViewEvent,
        fn: (source, clockParams) => ({ ...source, ...clockParams }),
    })

    split({
        source: dispatcherEvent,
        match: {
            exit: ({ wasChecked }) => wasChecked,
            next: ({ additionalsViews, componentsToUpdate, viewsConditionsAllDeps }) => {
                if (!isNotEmpty(additionalsViews)) {
                    return false
                }

                const someComponentIsChanged = componentsToUpdate.some(({ isNewValue }) => !!isNewValue)
                if (!someComponentIsChanged) {
                    return false
                }

                const componentsToUpdateSet = new Set(componentsToUpdate.map(({ componentId }) => componentId))
                const someDepsIsChanged = Array.from(viewsConditionsAllDeps).some((depId) => componentsToUpdateSet.has(depId))
                if (!someDepsIsChanged) {
                    return false
                }

                return true
            },
        },
        cases: {
            exit: setFalseWasCheckedEvent,
            next: runCalcNextViewEvent,
        },
    })

    const resultOfViewChangeCheckEvent = sample({
        source: {
            getIsConditionSuccessfulChecker: componentsModel.$getIsConditionSuccessfulChecker,
            viewsConditionsDeps: depsOfRulesModel.$viewsConditionsDeps,
            additionalsViews: viewsService.$additionalsViews,
            curentViewId: viewsService.$curentViewId,
        },
        clock: runCalcNextViewEvent,
        fn: ({ getIsConditionSuccessfulChecker, viewsConditionsDeps, additionalsViews, curentViewId }) => {
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

            return { isNewView, viewId: newViewId }
        },
    })

    const canBeChangeViewEvent = sample({
        clock: resultOfViewChangeCheckEvent,
        filter: ({ isNewView }) => isNewView,
        fn: ({ viewId }) => viewId,
    })

    sample({
        clock: canBeChangeViewEvent,
        target: setTrueWasCheckedEvent,
    })

    sample({
        clock: canBeChangeViewEvent,
        target: viewsService.setCurrentViewIdEvent,
    })

    return { runViewChangeCheckEvent: guardForChangeViewEvent, canBeChangeViewEvent }
}
