import { ComponentSchema, ComponentValidationResult, EntityId, validationKeys } from '@form-crafter/core'
import { isNotEmpty, isNotNull } from '@form-crafter/utils'
import { attach, combine, createEffect, createStore, Store, StoreWritable } from 'effector'

import { ComponentsValidationErrors } from '../../../../components-validation-errors-model'
import { ComponentModelParams } from '../../types'
import { RunComponentValidationFxDone, RunComponentValidationFxFail } from '../types'
import { RunComponentValidationFxParams } from './types'
import { getPermanentValidationsByKey } from './utils'

type ComponentValidationModelParams<S extends ComponentSchema> = Pick<
    ComponentModelParams,
    '$getExecutorContextBuilder' | 'componentsValidationErrorsModel' | 'readyConditionalValidationsModel' | 'themeService'
> & {
    $componentId: Store<EntityId>
    $schema: StoreWritable<S>
    validationIsAvailable: boolean
}

export const createComponentValidationModel = <S extends ComponentSchema>({
    $getExecutorContextBuilder,
    $componentId,
    $schema,
    readyConditionalValidationsModel,
    componentsValidationErrorsModel,
    themeService,
    validationIsAvailable,
}: ComponentValidationModelParams<S>) => {
    const $isValidationPending = createStore<boolean>(false)

    const $componentErrors = combine(
        componentsValidationErrorsModel.$visibleErrors,
        $componentId,
        (validationErrors, componentId) => validationErrors[componentId] || null,
    )
    const $errorsArr = combine($componentErrors, (componentErrors) => (isNotEmpty(componentErrors) ? Array.from(componentErrors.values()) : null))
    const $firstError = combine($errorsArr, (errors) => (isNotEmpty(errors) ? errors[0] : null))

    const $readyComponentConditionalValidations = combine(
        readyConditionalValidationsModel.$readyComponentsRules,
        $componentId,
        (readyConditionalValidations, componentId) => {
            const rules = readyConditionalValidations[componentId]
            return isNotEmpty(rules) ? rules : null
        },
    )
    const $readyComponentConditionalValidationsByKey = combine(
        readyConditionalValidationsModel.$readyComponentsRulesByKey,
        $componentId,
        (readyConditionalValidationsByKey, componentId) => {
            const rules = readyConditionalValidationsByKey[componentId]
            return isNotEmpty(rules) ? rules : null
        },
    )
    const $readyPermanentValidationsRules = combine($schema, (schema) => getPermanentValidationsByKey(schema.validations?.schemas || []))

    const $isRequired = combine(
        $readyComponentConditionalValidationsByKey,
        $readyPermanentValidationsRules,
        (readyComponentConditionalValidationsByKey, readyPermanentValidationsRules) => {
            const readyByIsRequired = new Set([
                ...(readyComponentConditionalValidationsByKey?.[validationKeys.isRequired] || new Set()),
                ...(readyPermanentValidationsRules?.[validationKeys.isRequired] || new Set()),
            ])

            if (isNotEmpty(readyByIsRequired) && readyByIsRequired.size !== 0) {
                return true
            }

            return false
        },
    )

    const baseRunValidationFx = createEffect<RunComponentValidationFxParams<S>, RunComponentValidationFxDone, RunComponentValidationFxFail>(
        async ({ schema, getExecutorContextBuilder, readyComponentConditionalValidations, componentsValidationsRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const executorContext = getExecutorContextBuilder()

            const newErrors: ComponentsValidationErrors[keyof ComponentsValidationErrors] = new Map()

            for (const validationSchema of schema.validations?.schemas || []) {
                const { id: validaionSchemaId, key, options, condition } = validationSchema

                const ruleIsReady = isNotEmpty(condition) ? readyComponentConditionalValidations?.has(validaionSchemaId) : true
                if (!ruleIsReady) {
                    continue
                }

                const rule = componentsValidationsRules[key]

                let validationResult: ComponentValidationResult

                switch (rule.type) {
                    case 'component': {
                        validationResult = rule.validate(schema, { ctx: executorContext, options: options || {} })
                        break
                    }
                }

                // TODO если null то по сути success валидация и убараются все ошибки, НО НУЖНО ОСТАВЬ ИХ. Проверить есть ои ошибки с validationSchemaId и добавь в переменные.
                if (isNotNull(validationResult) && !validationResult.isValid) {
                    newErrors.set(validaionSchemaId, { id: validaionSchemaId, key, message: validationResult.message })
                }
            }

            if (isNotEmpty(newErrors)) {
                return Promise.reject({
                    errors: newErrors,
                })
            }

            return Promise.resolve()
        },
    )
    const runValidationFx = attach({
        source: {
            schema: $schema,
            getExecutorContextBuilder: $getExecutorContextBuilder,
            readyComponentConditionalValidations: $readyComponentConditionalValidations,
            componentsValidationsRules: themeService.$componentsValidationsRules,
        },
        mapParams: (_: void, payload) => ({
            ...payload,
        }),
        effect: baseRunValidationFx,
    })

    if (validationIsAvailable) {
        $isValidationPending.on(runValidationFx, () => true)
        $isValidationPending.on(runValidationFx.finally, () => false)
    }

    return {
        runValidationFx,
        $errors: $errorsArr,
        $firstError,
        $isRequired,
        $isValidationPending,
        validationIsAvailable,
    }
}
