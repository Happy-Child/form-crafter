import { ComponentsValidationErrors, ComponentsValidationErrorsModel, EntityId, SetComponentValidationErrorsPayload } from '@form-crafter/core'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'

import { ComponentsGeneralModel } from '../components-general-model'
import { filterValidationErrors, isErrorsDifferent, removeValidationErrors } from './utils'

type Params = {
    componentsGeneralModel: ComponentsGeneralModel
}

export const createComponentsValidationErrorsModel = ({ componentsGeneralModel }: Params): ComponentsValidationErrorsModel => {
    const $componentsGroupsErrors = createStore<ComponentsValidationErrors>({})
    const $componentsErrors = createStore<ComponentsValidationErrors>({})

    const $mergedErrors = createStore<ComponentsValidationErrors>({})

    const setMergedErrors = createEvent<ComponentsValidationErrors>('setMergedErrors')

    const setComponentsGroupsErrors = createEvent<ComponentsValidationErrors>('setComponentsGroupsErrors')
    const clearComponentsGroupsErrors = createEvent<void>('clearComponentsGroupsErrors')
    const removeGroupsErrors = createEvent<Set<EntityId>>('removeGroupErrors')

    const setComponentErrors = createEvent<SetComponentValidationErrorsPayload>('setComponentErrors')
    const clearComponentsErrors = createEvent<void>('clearComponentsErrors')
    const removeComponentsErrors = createEvent<Set<EntityId>>('removeComponentsErrors')

    const filterAllErrors = createEvent<Set<EntityId>>('filterAllErrors')

    const removeAllComponentsErrors = createEvent<Set<EntityId>>('removeAllComponentsErrors')

    const removeAllErrors = createEvent('removeAllErrors')

    const $visibleErrors = combine($mergedErrors, componentsGeneralModel.$hiddenComponents, (validationErrors, hiddenComponentsIds) => {
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

    $mergedErrors.on(setMergedErrors, (_, newErrors) => newErrors)

    $componentsGroupsErrors.on(setComponentsGroupsErrors, (curErrors, newErrors) => ({ ...curErrors, ...newErrors }))
    $componentsGroupsErrors.on(removeGroupsErrors, removeValidationErrors)
    $componentsGroupsErrors.reset(clearComponentsGroupsErrors)

    $componentsErrors.on(setComponentErrors, (curErrors, { componentId, errors }) => ({ ...curErrors, [componentId]: errors }))
    $componentsErrors.on(removeComponentsErrors, removeValidationErrors)
    $componentsErrors.reset(clearComponentsErrors)

    $componentsGroupsErrors.on(filterAllErrors, filterValidationErrors)
    $componentsErrors.on(filterAllErrors, filterValidationErrors)

    sample({
        clock: removeAllComponentsErrors,
        target: [removeGroupsErrors, removeComponentsErrors],
    })

    sample({
        clock: removeAllErrors,
        target: [clearComponentsGroupsErrors, clearComponentsErrors],
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
        target: setMergedErrors,
    })

    return {
        setComponentErrors,
        setComponentsGroupsErrors,
        removeComponentsErrors,
        removeAllComponentsErrors,
        removeAllErrors,
        filterAllErrors,
        clearComponentsGroupsErrors,
        $componentsGroupsErrors,
        $componentsErrors,
        $mergedErrors,
        $visibleErrors,
    }
}
