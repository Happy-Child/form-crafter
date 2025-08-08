import { EntityId } from '@form-crafter/core'
import { combine, createEvent, createStore, sample, StoreWritable, UnitValue } from 'effector'

import { isErrorsDifferent } from '../utils'
import { ComponentsValidationErrors, SetComponentValidationErrorsPayload } from './types'
import { filterValidationErrors, removeValidationErrors } from './utils'

type Params = {
    $hiddenComponents: StoreWritable<Set<EntityId>>
}

export const createValidationsErrorsModel = ({ $hiddenComponents }: Params) => {
    const $componentsGroupsValidationErrors = createStore<ComponentsValidationErrors>({})
    const $componentsValidationErrors = createStore<ComponentsValidationErrors>({})

    const $validationErrors = createStore<ComponentsValidationErrors>({})

    const setValidationErrorsEvent = createEvent<ComponentsValidationErrors>('setValidationErrorsEvent')

    const setComponentsGroupsValidationErrorsEvent = createEvent<ComponentsValidationErrors>('setComponentsGeoupsValidationErrorsEvent')
    const clearComponentsGroupsValidationErrorsEvent = createEvent<void>('clearComponentsGroupsValidationErrorsEvent')
    const removeGroupValidationErrorsEvent = createEvent<EntityId>('removeGroupValidationErrorsEvent')

    const setComponentValidationErrorsEvent = createEvent<SetComponentValidationErrorsPayload>('setComponentValidationErrorsEvent')
    const removeComponentValidationErrorsEvent = createEvent<EntityId>('removeComponentValidationErrorsEvent')

    const filterAllValidationErrorsEvent = createEvent<Set<EntityId>>('filterAllValidationErrorsEvent')

    const removeAllValidationErrorsEvent = createEvent<EntityId>('removeAllValidationErrorsEvent')

    const $visibleValidationErrors = combine($validationErrors, $hiddenComponents, (validationErrors, hiddenComponents) => {
        const filteredErrors: UnitValue<typeof $validationErrors> = { ...validationErrors }
        let wasDeleted = false

        for (const componentId of hiddenComponents) {
            if (!(componentId in filteredErrors)) {
                continue
            }

            delete filteredErrors[componentId]
            wasDeleted = true
        }

        return wasDeleted ? filteredErrors : validationErrors
    })

    $validationErrors.on(setValidationErrorsEvent, (_, newErrors) => newErrors)

    $componentsGroupsValidationErrors.on(setComponentsGroupsValidationErrorsEvent, (curErrors, newErrors) => ({ ...curErrors, ...newErrors }))
    $componentsGroupsValidationErrors.reset(clearComponentsGroupsValidationErrorsEvent)
    $componentsGroupsValidationErrors.on(removeGroupValidationErrorsEvent, removeValidationErrors)

    $componentsValidationErrors.on(setComponentValidationErrorsEvent, (curErrors, { componentId, errors }) => ({ ...curErrors, [componentId]: errors }))
    $componentsValidationErrors.on(removeComponentValidationErrorsEvent, removeValidationErrors)

    $componentsGroupsValidationErrors.on(filterAllValidationErrorsEvent, filterValidationErrors)
    $componentsValidationErrors.on(filterAllValidationErrorsEvent, filterValidationErrors)

    sample({
        clock: removeAllValidationErrorsEvent,
        target: [removeGroupValidationErrorsEvent, removeComponentValidationErrorsEvent],
    })

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
        removeComponentValidationErrorsEvent,
        removeAllValidationErrorsEvent,
        filterAllValidationErrorsEvent,
        clearComponentsGroupsValidationErrorsEvent,
        $componentsGroupsValidationErrors,
        $componentsValidationErrors,
        $validationErrors,
        $visibleValidationErrors,
    }
}
