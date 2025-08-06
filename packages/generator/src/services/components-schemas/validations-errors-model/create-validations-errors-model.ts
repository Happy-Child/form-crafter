import { EntityId } from '@form-crafter/core'
import { createEvent, createStore, sample, UnitValue } from 'effector'

import { isErrorsDifferent } from '../utils'
import { ComponentsValidationErrors, SetComponentValidationErrorsPayload } from './types'
import { filterValidationErrors } from './utils'

export const createValidationsErrorsModel = () => {
    const $componentsGroupsValidationErrors = createStore<ComponentsValidationErrors>({})
    const $componentsValidationErrors = createStore<ComponentsValidationErrors>({})

    const $validationErrors = createStore<ComponentsValidationErrors>({})

    const setComponentValidationErrorsEvent = createEvent<SetComponentValidationErrorsPayload>('setComponentValidationErrorsEvent')
    const setComponentsGroupsValidationErrorsEvent = createEvent<ComponentsValidationErrors>('setComponentsGeoupsValidationErrorsEvent')
    const removeValidationErrorsEvent = createEvent<EntityId>('removeValidationErrorsEvent')
    const filterValidationErrorsEvent = createEvent<Set<EntityId>>('filterValidationErrorsEvent')
    const clearComponentsGroupsValidationErrorsEvent = createEvent<void>('clearComponentsGroupsValidationErrorsEvent')
    const setValidationErrorsEvent = createEvent<ComponentsValidationErrors>('setValidationErrorsEvent')

    $componentsGroupsValidationErrors.on(setComponentsGroupsValidationErrorsEvent, (curErrors, newErrors) => ({ ...curErrors, ...newErrors }))
    $componentsGroupsValidationErrors.on(removeValidationErrorsEvent, (curErrors, componentId) => {
        if (componentId in curErrors) {
            delete curErrors[componentId]
            return { ...curErrors }
        }
        return curErrors
    })
    $componentsGroupsValidationErrors.on(filterValidationErrorsEvent, filterValidationErrors)
    $componentsGroupsValidationErrors.reset(clearComponentsGroupsValidationErrorsEvent)

    $componentsValidationErrors.on(setComponentValidationErrorsEvent, (curErrors, { componentId, errors }) => ({ ...curErrors, [componentId]: errors }))
    $componentsValidationErrors.on(removeValidationErrorsEvent, (curErrors, componentId) => {
        if (componentId in curErrors) {
            delete curErrors[componentId]
            return { ...curErrors }
        }
        return curErrors
    })
    $componentsValidationErrors.on(filterValidationErrorsEvent, filterValidationErrors)

    $validationErrors.on(setValidationErrorsEvent, (_, newErrors) => newErrors)

    sample({
        source: {
            validationErrors: $validationErrors,
            componentsGroupsValidationErrors: $componentsGroupsValidationErrors,
            componentsValidationErrors: $componentsValidationErrors,
        },
        clock: [$componentsGroupsValidationErrors.updates, $componentsValidationErrors.updates],
        fn: ({ validationErrors, componentsGroupsValidationErrors, componentsValidationErrors }) => {
            const resultErrors: UnitValue<typeof $validationErrors> = {}

            const failedComponentsIds = new Set([...Object.keys(componentsValidationErrors), ...Object.keys(componentsGroupsValidationErrors)])

            for (const componentId of failedComponentsIds) {
                const errors = componentsValidationErrors[componentId] || new Map()
                const groupsErrors = componentsGroupsValidationErrors[componentId] || new Map()

                const curMergedComponentErrors = validationErrors[componentId]
                const newMergedComponentErrors = new Map([...errors, ...groupsErrors])

                const res = isErrorsDifferent(curMergedComponentErrors || new Map(), newMergedComponentErrors)

                if (!res) {
                    resultErrors[componentId] = curMergedComponentErrors
                    continue
                }

                resultErrors[componentId] = newMergedComponentErrors
            }

            return resultErrors
        },
        target: setValidationErrorsEvent,
    })

    return {
        setComponentValidationErrorsEvent,
        setComponentsGroupsValidationErrorsEvent,
        removeValidationErrorsEvent,
        filterValidationErrorsEvent,
        clearComponentsGroupsValidationErrorsEvent,
        $componentsGroupsValidationErrors,
        $componentsValidationErrors,
        $validationErrors,
    }
}
