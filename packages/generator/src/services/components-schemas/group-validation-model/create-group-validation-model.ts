import { EntityId, GroupValidationError } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, createEffect, createEvent, createStore, EventCallable, sample, StoreWritable, UnitValue } from 'effector'

import { SchemaMap } from '../../../types'
import { extractComponentsSchemasModels } from '../../../utils'
import { SchemaService } from '../../schema'
import { ThemeService } from '../../theme'
import { ComponentsValidationErrors, ReadyValidationsRules, UpdateGroupComponentsValidationErrorsPayload } from '../types'
import { buildExecutorContext } from '../utils'
import { RunGroupValidationFxDone, RunGroupValidationFxFail, RunGroupValidationFxParams } from './types'

type GroupValidationModelParams = Pick<ThemeService, '$groupValidationRules'> &
    Pick<SchemaService, '$groupValidationSchemas'> & {
        updateGroupComponentsValidationErrorsPayload: EventCallable<UpdateGroupComponentsValidationErrorsPayload>
        $componentsSchemasModel: StoreWritable<SchemaMap>
        $readyConditionalGroupValidationRules: StoreWritable<ReadyValidationsRules[keyof ReadyValidationsRules]>
    }

export const createGroupValidationModel = ({
    updateGroupComponentsValidationErrorsPayload,
    $componentsSchemasModel,
    $groupValidationRules,
    $groupValidationSchemas,
    $readyConditionalGroupValidationRules,
}: GroupValidationModelParams) => {
    const validationIsAvailable = isNotEmpty($groupValidationSchemas.getState())

    const $isValidationPending = createStore<boolean>(false)

    const $groupValidationErrors = createStore<GroupValidationError[]>([])

    const $failedComponentsByGroupValidationId = createStore<Record<EntityId, EntityId[]>>({})

    const baseRunGroupValidationsFx = createEffect<RunGroupValidationFxParams, RunGroupValidationFxDone, RunGroupValidationFxFail>(
        async ({ componentsSchemasModel, groupValidationRules, groupValidationSchemas, readyConditionalValidationRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const executorContext = buildExecutorContext({ componentsSchemas })

            const groupsErrors: GroupValidationError[] = []
            const componentsErrors: ComponentsValidationErrors = {}

            for (const [, validationSchema] of Object.entries(groupValidationSchemas)) {
                const { id: validationSchemaId, ruleName, options, condition } = validationSchema

                const ruleIsReady = isNotEmpty(condition) ? readyConditionalValidationRules?.readyBySchemaId?.has(validationSchemaId) : true
                if (!ruleIsReady) {
                    continue
                }

                const rule = groupValidationRules[ruleName]
                const validationResult = rule.validate({ ctx: executorContext, options: options || {} })

                if (!validationResult.isValid) {
                    if (isNotEmpty(validationResult.message)) {
                        groupsErrors.push({ id: validationSchemaId, ruleName, message: validationResult.message })
                    }

                    if (isNotEmpty(validationResult?.componentsErrors)) {
                        validationResult?.componentsErrors?.forEach((componentError) => {
                            if (!(componentError.componentId in componentsErrors)) {
                                componentsErrors[componentError.componentId] = []
                            }
                            componentsErrors[componentError.componentId].push({ id: validationSchemaId, ruleName, message: componentError.message })
                        })
                    }
                }
            }

            if (isNotEmpty(groupsErrors) || isNotEmpty(componentsErrors)) {
                return Promise.reject({
                    groupsErrors,
                    componentsErrors,
                })
            }

            return Promise.resolve()
        },
    )
    const runGroupValidationsFx = attach({
        source: {
            componentsSchemasModel: $componentsSchemasModel,
            groupValidationRules: $groupValidationRules,
            groupValidationSchemas: $groupValidationSchemas,
            readyConditionalValidationRules: $readyConditionalGroupValidationRules,
        },
        effect: baseRunGroupValidationsFx,
    })

    const setGroupValidationErrorsEvent = createEvent<UnitValue<typeof $groupValidationErrors>>('setGroupValidationErrorsEvent')

    const clearGroupValidationErrorsEvent = createEvent('clearGroupValidationErrorsEvent')

    const setFailedComponentsEvent = createEvent<UnitValue<typeof $failedComponentsByGroupValidationId>>('setFailedComponentsEvent')

    const removeFailedComponentsEvent = createEvent<EntityId[]>('removeFailedComponentsEvent')

    const clearFailedComponentsEvent = createEvent('clearFailedComponentsEvent')

    if (validationIsAvailable) {
        $isValidationPending.on(runGroupValidationsFx, () => true)
        $isValidationPending.on(runGroupValidationsFx.finally, () => false)

        $groupValidationErrors.on(setGroupValidationErrorsEvent, (_, newErrors) => newErrors)
        $groupValidationErrors.on(clearGroupValidationErrorsEvent, () => [])

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
            fn: ({ componentsErrors }) => ({ errors: componentsErrors! }),
            target: updateGroupComponentsValidationErrorsPayload,
        })

        sample({
            clock: runGroupValidationsFx.doneData,
            target: clearGroupValidationErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.failData,
            filter: ({ groupsErrors }) => isNotEmpty(groupsErrors),
            fn: ({ groupsErrors }) => groupsErrors!,
            target: setGroupValidationErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.doneData,
            target: clearFailedComponentsEvent,
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
    }

    return {
        runGroupValidationsFx,
        removeFailedComponentsEvent,
        $groupValidationErrors,
        $isValidationPending,
        validationIsAvailable,
    }
}
