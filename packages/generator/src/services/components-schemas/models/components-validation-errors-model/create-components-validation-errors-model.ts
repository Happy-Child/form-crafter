import { EntityId } from '@form-crafter/core'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'

import { ComponentsModel } from '../components-model'
import { ComponentsValidationErrors, SetComponentValidationErrorsPayload } from './types'
import { filterValidationErrors, isErrorsDifferent, removeValidationErrors } from './utils'

type Params = {
    componentsModel: ComponentsModel
}

export type ComponentsValidationErrorsModel = ReturnType<typeof createComponentsValidationErrorsModel>

export const createComponentsValidationErrorsModel = ({ componentsModel }: Params) => {
    const $componentsGroupsErrors = createStore<ComponentsValidationErrors>({})
    const $componentsErrors = createStore<ComponentsValidationErrors>({})

    const $mergedErrors = createStore<ComponentsValidationErrors>({})

    const setMergedErrorsEvent = createEvent<ComponentsValidationErrors>('setMergedErrorsEvent')

    const setComponentsGroupsErrorsEvent = createEvent<ComponentsValidationErrors>('setComponentsGroupsErrorsEvent')
    const clearComponentsGroupsErrorsEvent = createEvent<void>('clearComponentsGroupsErrorsEvent')
    const removeGroupErrorsEvent = createEvent<EntityId>('removeGroupErrorsEvent')

    const setComponentErrorsEvent = createEvent<SetComponentValidationErrorsPayload>('setComponentErrorsEvent')
    const clearComponentsErrors = createEvent<void>('clearComponentsErrors')
    const removeComponentErrorsEvent = createEvent<EntityId>('removeComponentErrorsEvent')

    const filterAllErrorsEvent = createEvent<Set<EntityId>>('filterAllErrorsEvent')

    const removeAllComponentErrors = createEvent<EntityId>('removeAllComponentErrors')

    const removeAllErrors = createEvent('removeAllErrors')

    const $visibleErrors = combine($mergedErrors, componentsModel.$hiddenComponents, (validationErrors, hiddenComponentsIds) => {
        const filteredErrors: UnitValue<typeof $mergedErrors> = { ...validationErrors }
        let wasDeleted = false

        for (const componentId of hiddenComponentsIds) {
            if (!(componentId in filteredErrors)) {
                continue
            }

            delete filteredErrors[componentId]
            wasDeleted = true
        }

        return wasDeleted ? filteredErrors : validationErrors
    })

    $mergedErrors.on(setMergedErrorsEvent, (_, newErrors) => newErrors)

    $componentsGroupsErrors.on(setComponentsGroupsErrorsEvent, (curErrors, newErrors) => ({ ...curErrors, ...newErrors }))
    $componentsGroupsErrors.on(removeGroupErrorsEvent, removeValidationErrors)
    $componentsGroupsErrors.reset(clearComponentsGroupsErrorsEvent)

    $componentsErrors.on(setComponentErrorsEvent, (curErrors, { componentId, errors }) => ({ ...curErrors, [componentId]: errors }))
    $componentsErrors.on(removeComponentErrorsEvent, removeValidationErrors)
    $componentsErrors.reset(clearComponentsErrors)

    $componentsGroupsErrors.on(filterAllErrorsEvent, filterValidationErrors)
    $componentsErrors.on(filterAllErrorsEvent, filterValidationErrors)

    sample({
        clock: removeAllComponentErrors,
        target: [removeGroupErrorsEvent, removeComponentErrorsEvent],
    })

    sample({
        clock: removeAllErrors,
        target: [clearComponentsGroupsErrorsEvent, clearComponentsErrors],
    })

    sample({
        source: {
            mergedErrors: $mergedErrors,
            componentsGroupsErrors: $componentsGroupsErrors,
            componentsErrors: $componentsErrors,
        },
        clock: [$componentsGroupsErrors.updates, $componentsErrors.updates],
        fn: ({ mergedErrors, componentsGroupsErrors, componentsErrors }) => {
            const resultErrors: UnitValue<typeof $mergedErrors> = {}

            const failedComponentsIds = new Set([...Object.keys(componentsErrors), ...Object.keys(componentsGroupsErrors)])

            for (const componentId of failedComponentsIds) {
                const errors = componentsErrors[componentId] || new Map()
                const groupsErrors = componentsGroupsErrors[componentId] || new Map()

                const curMergedComponentErrors = mergedErrors[componentId]
                const newMergedComponentErrors = new Map([...errors, ...groupsErrors])

                const isDifferent = isErrorsDifferent(curMergedComponentErrors || new Map(), newMergedComponentErrors)

                if (!isDifferent) {
                    resultErrors[componentId] = curMergedComponentErrors
                    continue
                }

                resultErrors[componentId] = newMergedComponentErrors
            }

            return resultErrors
        },
        target: setMergedErrorsEvent,
    })

    return {
        setComponentErrorsEvent,
        setComponentsGroupsErrorsEvent,
        removeComponentErrorsEvent,
        removeAllComponentErrors,
        removeAllErrors,
        filterAllErrorsEvent,
        clearComponentsGroupsErrorsEvent,
        $componentsGroupsErrors,
        $componentsErrors,
        $mergedErrors,
        $visibleErrors,
    }
}
