import { EntityId, GroupValidationError } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, createEffect, createEvent, createStore, EventCallable, sample, StoreWritable, UnitValue } from 'effector'

import { SchemaService } from '../../schema'
import { ThemeService } from '../../theme'
import { ComponentsSchemasModel, extractComponentsSchemasModels } from '../components-models'
import { ReadyValidationsRules } from '../types'
import { buildExecutorContext } from '../utils'
import { ComponentsValidationErrors } from '../validations-errors-model'
import { RunGroupValidationFxDone, RunGroupValidationFxFail, RunGroupValidationFxParams } from './types'

type GroupValidationModelParams = Pick<ThemeService, '$groupValidationRules'> &
    Pick<SchemaService, '$groupValidationSchemas'> & {
        setComponentsGroupsValidationErrorsEvent: EventCallable<ComponentsValidationErrors>
        clearComponentsGroupsValidationErrorsEvent: EventCallable<void>
        $componentsGroupsValidationErrors: StoreWritable<ComponentsValidationErrors>
        $componentsSchemasModel: StoreWritable<ComponentsSchemasModel>
        $readyConditionalGroupValidationRules: StoreWritable<ReadyValidationsRules[keyof ReadyValidationsRules]>
    }

export const createGroupValidationModel = ({
    setComponentsGroupsValidationErrorsEvent,
    clearComponentsGroupsValidationErrorsEvent,
    $componentsGroupsValidationErrors,
    $componentsSchemasModel,
    $groupValidationRules,
    $groupValidationSchemas,
    $readyConditionalGroupValidationRules,
}: GroupValidationModelParams) => {
    const validationIsAvailable = isNotEmpty($groupValidationSchemas.getState())

    const $isValidationPending = createStore<boolean>(false)

    const $errors = createStore<Map<EntityId, GroupValidationError>>(new Map())

    const baseRunGroupValidationsFx = createEffect<RunGroupValidationFxParams, RunGroupValidationFxDone, RunGroupValidationFxFail>(
        async ({ componentsGroupsValidationErrors, componentsSchemasModel, groupValidationRules, groupValidationSchemas, readyConditionalValidationRules }) => {
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
                            const componentCurErrors = componentsGroupsValidationErrors[componentError.componentId]

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
            componentsGroupsValidationErrors: $componentsGroupsValidationErrors,
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

        sample({
            clock: runGroupValidationsFx.failData,
            filter: ({ componentsErrors }) => isNotEmpty(componentsErrors),
            fn: ({ componentsErrors }) => componentsErrors!,
            target: setComponentsGroupsValidationErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.failData,
            filter: ({ groupsErrors }) => isNotEmpty(groupsErrors),
            fn: ({ groupsErrors }) => groupsErrors!,
            target: setErrorsEvent,
        })

        sample({
            clock: runGroupValidationsFx.doneData,
            target: [clearComponentsGroupsValidationErrorsEvent, clearErrorsEvent],
        })
    }

    return {
        runGroupValidationsFx,
        filterErrorsEvent,
        $errors,
        $isValidationPending,
    }
}
