import { EntityId, GroupValidationError } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, createEffect, createEvent, createStore, EventCallable, sample, StoreWritable, UnitValue } from 'effector'

import { SchemaMap } from '../../../types'
import { extractComponentsSchemasModels } from '../../../utils'
import { SchemaService } from '../../schema'
import { ThemeService } from '../../theme'
import { ComponentsValidationErrors, ReadyValidationsRules } from '../types'
import { buildExecutorContext } from '../utils'
import { RunGroupValidationFxDone, RunGroupValidationFxFail, RunGroupValidationFxParams } from './types'

type GroupValidationModelParams = Pick<ThemeService, '$groupValidationRules'> &
    Pick<SchemaService, '$groupValidationSchemas'> & {
        setComponentsValidationErrorsEvent: EventCallable<ComponentsValidationErrors>
        filterComponentsValidationErrorsEvent: EventCallable<Set<EntityId>>
        $componentsValidationErrors: StoreWritable<ComponentsValidationErrors>
        $componentsSchemasModel: StoreWritable<SchemaMap>
        $readyConditionalGroupValidationRules: StoreWritable<ReadyValidationsRules[keyof ReadyValidationsRules]>
    }

export const createGroupValidationModel = ({
    setComponentsValidationErrorsEvent,
    filterComponentsValidationErrorsEvent,
    $componentsValidationErrors,
    $componentsSchemasModel,
    $groupValidationRules,
    $groupValidationSchemas,
    $readyConditionalGroupValidationRules,
}: GroupValidationModelParams) => {
    const validationIsAvailable = isNotEmpty($groupValidationSchemas.getState())

    const $isValidationPending = createStore<boolean>(false)

    const $errors = createStore<Map<EntityId, GroupValidationError>>(new Map())

    const $failedComponentsByGroupValidationId = createStore<Record<EntityId, EntityId[]>>({})

    const baseRunGroupValidationsFx = createEffect<RunGroupValidationFxParams, RunGroupValidationFxDone, RunGroupValidationFxFail>(
        async ({ componentsValidationErrors, componentsSchemasModel, groupValidationRules, groupValidationSchemas, readyConditionalValidationRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const executorContext = buildExecutorContext({ componentsSchemas })

            const finalGroupsErrors: UnitValue<typeof $errors> = new Map()
            const finalComponentsErrors: ComponentsValidationErrors = {}

            for (const [, validationSchema] of Object.entries(groupValidationSchemas)) {
                const { id: validationSchemaId, ruleName, options, condition } = validationSchema

                const ruleIsReady = isNotEmpty(condition) ? readyConditionalValidationRules?.has(validationSchemaId) : true
                if (!ruleIsReady) {
                    continue
                }

                const rule = groupValidationRules[ruleName]
                const validationResult = rule.validate({ ctx: executorContext, options: options || {} })

                if (!validationResult.isValid) {
                    if (isNotEmpty(validationResult.message)) {
                        finalGroupsErrors.set(validationSchemaId, { id: validationSchemaId, ruleName, message: validationResult.message })
                    }

                    if (isNotEmpty(validationResult?.componentsErrors)) {
                        validationResult?.componentsErrors?.forEach((componentError) => {
                            const componentCurErrors = componentsValidationErrors[componentError.componentId]

                            const thisErrorExists = componentCurErrors?.has(validationSchemaId)
                            const isNewErrorMessage = componentCurErrors?.get(validationSchemaId)?.message !== componentError.message

                            if (thisErrorExists && !isNewErrorMessage) {
                                return
                            }

                            if (!(componentError.componentId in finalComponentsErrors)) {
                                finalComponentsErrors[componentError.componentId] = new Map()
                            }
                            finalComponentsErrors[componentError.componentId].set(validationSchemaId, {
                                id: validationSchemaId,
                                ruleName,
                                message: componentError.message,
                            })
                        })
                    }
                } else {
                }
            }

            if (isNotEmpty(finalGroupsErrors) || isNotEmpty(finalComponentsErrors)) {
                return Promise.reject({
                    groupsErrors: finalGroupsErrors,
                    componentsErrors: finalComponentsErrors,
                })
            }

            return Promise.resolve()
        },
    )
    const runGroupValidationsFx = attach({
        source: {
            componentsValidationErrors: $componentsValidationErrors,
            componentsSchemasModel: $componentsSchemasModel,
            groupValidationRules: $groupValidationRules,
            groupValidationSchemas: $groupValidationSchemas,
            readyConditionalValidationRules: $readyConditionalGroupValidationRules,
        },
        effect: baseRunGroupValidationsFx,
    })

    const setErrorsEvent = createEvent<UnitValue<typeof $errors>>('setErrorsEvent')

    const clearErrorsEvent = createEvent('clearErrorsEvent')

    const filterErrorsEvent = createEvent<Set<EntityId>>('filterErrorsEvent')

    const setFailedComponentsEvent = createEvent<UnitValue<typeof $failedComponentsByGroupValidationId>>('setFailedComponentsEvent')

    const removeFailedComponentsEvent = createEvent<EntityId[]>('removeFailedComponentsEvent')

    const clearFailedComponentsEvent = createEvent('clearFailedComponentsEvent')

    if (validationIsAvailable) {
        $isValidationPending.on(runGroupValidationsFx, () => true)
        $isValidationPending.on(runGroupValidationsFx.finally, () => false)

        $errors.on(setErrorsEvent, (_, newErrors) => newErrors)
        $errors.reset(clearErrorsEvent)
        $errors.on(filterErrorsEvent, (errors, errorsToRemove) => {
            const newErrors = new Map(errors)
            for (const validationSchemaId of errorsToRemove) {
                newErrors.delete(validationSchemaId)
            }
            return newErrors
        })

        $failedComponentsByGroupValidationId.on(setFailedComponentsEvent, (_, newData) => newData)
        $failedComponentsByGroupValidationId.on(removeFailedComponentsEvent, (failedComponents, validationSchemaIdsToDelete) => {
            validationSchemaIdsToDelete.forEach((id) => {
                delete failedComponents[id]
            })
            return { ...failedComponents }
        })
        $failedComponentsByGroupValidationId.on(clearFailedComponentsEvent, () => ({}))

        sample({
            clock: runGroupValidationsFx.failData,
            filter: ({ componentsErrors }) => isNotEmpty(componentsErrors),
            fn: ({ componentsErrors }) => componentsErrors!,
            target: setComponentsValidationErrorsEvent,
        })

        sample({
            source: $errors,
            clock: runGroupValidationsFx.failData,
            filter: (_, { groupsErrors }) => isNotEmpty(groupsErrors),
            fn: (curErrors, { groupsErrors: newErrors }) => {
                const errorsToRemove = new Set<EntityId>()

                for (const [validationSchemaId] of curErrors) {
                    if (newErrors!.has(validationSchemaId)) {
                        continue
                    }
                    errorsToRemove.add(validationSchemaId)
                }

                return errorsToRemove
            },
            target: filterComponentsValidationErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.failData,
            filter: ({ groupsErrors }) => isNotEmpty(groupsErrors),
            fn: ({ groupsErrors }) => groupsErrors!,
            target: setErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.failData,
            filter: ({ componentsErrors }) => isNotEmpty(componentsErrors),
            fn: ({ componentsErrors }) =>
                Object.entries(componentsErrors!).reduce<UnitValue<typeof $failedComponentsByGroupValidationId>>((result, [componentId, errors]) => {
                    errors.forEach((error) => {
                        if (!(error.id in result)) {
                            result[error.id] = []
                        }
                        result[error.id].push(componentId)
                    })
                    return result
                }, {}),
            target: setFailedComponentsEvent,
        })

        sample({
            source: $errors,
            clock: runGroupValidationsFx.doneData,
            fn: (curErrors) => new Set(Array.from(curErrors.keys())),
            target: filterComponentsValidationErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.doneData,
            target: [clearErrorsEvent, clearFailedComponentsEvent],
        })
    }

    return {
        runGroupValidationsFx,
        filterErrorsEvent,
        removeFailedComponentsEvent,
        $errors,
        $isValidationPending,
    }
}
