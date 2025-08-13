import { EntityId, GroupValidationError } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, createEffect, createEvent, createStore, sample, UnitValue } from 'effector'

import { SchemaService } from '../../../../../schema'
import { ThemeService } from '../../../../../theme'
import { ComponentsModel } from '../../../components-model'
import { ComponentsValidationErrors, ComponentsValidationErrorsModel } from '../../../components-validation-errors-model'
import { ReadyConditionalValidationRulesModel } from '../../../ready-conditional-validation-rules-model'
import { RunGroupValidationFxDone, RunGroupValidationFxFail, RunGroupValidationFxParams } from './types'

type Params = {
    componentsModel: ComponentsModel
    componentsValidationErrorsModel: ComponentsValidationErrorsModel
    readyConditionalValidationRulesModel: ReadyConditionalValidationRulesModel
    themeService: ThemeService
    schemaService: SchemaService
}

export const createGroupValidationModel = ({
    componentsModel,
    componentsValidationErrorsModel,
    readyConditionalValidationRulesModel,
    themeService,
    schemaService,
}: Params) => {
    const validationIsAvailable = isNotEmpty(schemaService.$groupValidationSchemas.getState())

    const $isValidationPending = createStore<boolean>(false)

    const $errors = createStore<Map<EntityId, GroupValidationError>>(new Map())

    const baseRunValidationsFx = createEffect<RunGroupValidationFxParams, RunGroupValidationFxDone, RunGroupValidationFxFail>(
        async ({ componentsGroupsErrors, getExecutorContextBuilder, groupValidationRules, groupValidationSchemas, readyConditionalValidationRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const executorContext = getExecutorContextBuilder()

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
                            const componentCurErrors = componentsGroupsErrors[componentError.componentId]

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
    const runValidationsFx = attach({
        source: {
            componentsGroupsErrors: componentsValidationErrorsModel.$componentsGroupsErrors,
            getExecutorContextBuilder: componentsModel.$getExecutorContextBuilder,
            readyConditionalValidationRules: readyConditionalValidationRulesModel.$readyGroupsRules,
            groupValidationRules: themeService.$groupValidationRules,
            groupValidationSchemas: schemaService.$groupValidationSchemas,
        },
        effect: baseRunValidationsFx,
    })

    const setErrorsEvent = createEvent<UnitValue<typeof $errors>>('setErrorsEvent')

    const clearErrorsEvent = createEvent('clearErrorsEvent')

    const filterErrorsEvent = createEvent<Set<EntityId>>('filterErrorsEvent')

    if (validationIsAvailable) {
        $isValidationPending.on(runValidationsFx, () => true)
        $isValidationPending.on(runValidationsFx.finally, () => false)

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
            clock: runValidationsFx.failData,
            filter: ({ componentsErrors }) => isNotEmpty(componentsErrors),
            fn: ({ componentsErrors }) => componentsErrors!,
            target: componentsValidationErrorsModel.setComponentsGroupsErrorsEvent,
        })

        sample({
            clock: runValidationsFx.failData,
            filter: ({ groupsErrors }) => isNotEmpty(groupsErrors),
            fn: ({ groupsErrors }) => groupsErrors!,
            target: setErrorsEvent,
        })

        sample({
            clock: runValidationsFx.doneData,
            target: [componentsValidationErrorsModel.setComponentsGroupsErrorsEvent, clearErrorsEvent],
        })
    }

    return {
        runValidationsFx,
        filterErrorsEvent,
        $errors,
        $isValidationPending,
    }
}
