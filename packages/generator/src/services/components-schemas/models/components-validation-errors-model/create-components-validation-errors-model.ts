import { EntityId } from '@form-crafter/core'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'

import { VisabilityComponentsModel } from '../visability-components-model'
import { ComponentsValidationErrors, SetComponentValidationErrorsPayload } from './types'
import { filterValidationErrors, isErrorsDifferent, removeValidationErrors } from './utils'

type Params = {
    visabilityComponentsModel: VisabilityComponentsModel
}

export type ComponentsValidationErrorsModel = ReturnType<typeof createComponentsValidationErrorsModel>

export const createComponentsValidationErrorsModel = ({ visabilityComponentsModel }: Params) => {
    const $componentsGroupsErrors = createStore<ComponentsValidationErrors>({})
    const $componentsErrors = createStore<ComponentsValidationErrors>({})

    const $mergedErrors = createStore<ComponentsValidationErrors>({})

    const setMergedErrorsEvent = createEvent<ComponentsValidationErrors>('setMergedErrorsEvent')

    const setComponentsGroupsErrorsEvent = createEvent<ComponentsValidationErrors>('setComponentsGroupsErrorsEvent')
    const clearComponentsGroupsErrorsEvent = createEvent<void>('clearComponentsGroupsErrorsEvent')
    const removeGroupErrorsEvent = createEvent<EntityId>('removeGroupErrorsEvent')

    const setComponentErrorsEvent = createEvent<SetComponentValidationErrorsPayload>('setComponentErrorsEvent')
    const removeComponentErrorsEvent = createEvent<EntityId>('removeComponentErrorsEvent')

    const filterAllErrorsEvent = createEvent<Set<EntityId>>('filterAllErrorsEvent')

    const removeAllErrorsEvent = createEvent<EntityId>('removeAllErrorsEvent')

    const $visibleErrors = combine($mergedErrors, visabilityComponentsModel.$hiddenComponents, (validationErrors, hiddenComponentsIds) => {
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
    $componentsGroupsErrors.reset(clearComponentsGroupsErrorsEvent)
    $componentsGroupsErrors.on(removeGroupErrorsEvent, removeValidationErrors)

    $componentsErrors.on(setComponentErrorsEvent, (curErrors, { componentId, errors }) => ({ ...curErrors, [componentId]: errors }))
    $componentsErrors.on(removeComponentErrorsEvent, removeValidationErrors)

    $componentsGroupsErrors.on(filterAllErrorsEvent, filterValidationErrors)
    $componentsErrors.on(filterAllErrorsEvent, filterValidationErrors)

    sample({
        clock: removeAllErrorsEvent,
        target: [removeGroupErrorsEvent, removeComponentErrorsEvent],
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
        removeAllErrorsEvent,
        filterAllErrorsEvent,
        clearComponentsGroupsErrorsEvent,
        $componentsGroupsErrors,
        $componentsErrors,
        $mergedErrors,
        $visibleErrors,
    }
}
