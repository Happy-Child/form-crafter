import {
    ComponentSchema,
    ComponentValidationResult,
    EntityId,
    isEditableValidationRule,
    isUploaderValidationRule,
    validationRuleNames,
} from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createStore, Store, StoreWritable } from 'effector'

import { buildExecutorContext, getPermanentValidationRulesByRuleName } from '../../utils'
import { ComponentsValidationErrors } from '../../validations-errors-model'
import { ComponentSchemaModelParams, RunComponentValidationFxDone, RunComponentValidationFxFail } from '../types'
import { extractComponentsSchemasModels } from '../utils'
import { RunComponentValidationFxParams } from './types'

type ComponentValidationModelParams<S extends ComponentSchema> = Pick<
    ComponentSchemaModelParams,
    '$componentsSchemasModel' | '$readyConditionalValidationRules' | '$readyConditionalValidationRulesByRuleName' | '$validationErrors' | 'themeService'
> & {
    $componentId: Store<EntityId>
    $schema: StoreWritable<S>
    validationIsAvailable: boolean
}

export const createComponentValidationModel = <S extends ComponentSchema>({
    $componentsSchemasModel,
    $readyConditionalValidationRules,
    $readyConditionalValidationRulesByRuleName,
    $validationErrors,
    $componentId,
    $schema,
    themeService,
    validationIsAvailable,
}: ComponentValidationModelParams<S>) => {
    const $isValidationPending = createStore<boolean>(false)

    const $componentErrors = combine($validationErrors, $componentId, (validationErrors, componentId) => validationErrors[componentId] || null)
    const $errorsArr = combine($componentErrors, (componentErrors) => (isNotEmpty(componentErrors) ? Array.from(componentErrors.values()) : null))
    const $firstError = combine($errorsArr, (errors) => (isNotEmpty(errors) ? errors[0] : null))

    const $readyComponentConditionalValidationRules = combine(
        $readyConditionalValidationRules,
        $componentId,
        (readyConditionalValidationRules, componentId) => {
            const rules = readyConditionalValidationRules[componentId]
            return isNotEmpty(rules) ? rules : null
        },
    )
    const $readyComponentConditionalValidationRulesByRuleName = combine(
        $readyConditionalValidationRulesByRuleName,
        $componentId,
        (readyConditionalValidationRulesByRuleName, componentId) => {
            const rules = readyConditionalValidationRulesByRuleName[componentId]
            return isNotEmpty(rules) ? rules : null
        },
    )
    const $readyPermanentValidationsRules = combine($schema, (schema) => getPermanentValidationRulesByRuleName(schema.validations?.schemas || []))

    const $isRequired = combine(
        $readyComponentConditionalValidationRulesByRuleName,
        $readyPermanentValidationsRules,
        (readyComponentConditionalValidationRulesByRuleName, readyPermanentValidationsRules) => {
            const readyByIsRequired = new Set([
                ...(readyComponentConditionalValidationRulesByRuleName?.[validationRuleNames.isRequired] || new Set()),
                ...(readyPermanentValidationsRules?.[validationRuleNames.isRequired] || new Set()),
            ])

            if (isNotEmpty(readyByIsRequired) && readyByIsRequired.size !== 0) {
                return true
            }

            return false
        },
    )

    const baseRunValidationFx = createEffect<RunComponentValidationFxParams<S>, RunComponentValidationFxDone, RunComponentValidationFxFail>(
        async ({ schema, componentsSchemasModel, readyComponentConditionalValidationRules, componentsValidationsRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const value = schema.properties.value
            const componentId = schema.meta.id

            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const executorContext = buildExecutorContext({ componentsSchemas })

            const newErrors: ComponentsValidationErrors[keyof ComponentsValidationErrors] = new Map()

            for (const validationSchema of schema.validations?.schemas || []) {
                const { id: validaionSchemaId, ruleName, options, condition } = validationSchema

                const ruleIsReady = isNotEmpty(condition) ? readyComponentConditionalValidationRules?.has(validaionSchemaId) : true
                if (!ruleIsReady) {
                    continue
                }

                const rule = componentsValidationsRules[ruleName]

                let validationResult: ComponentValidationResult

                if (isEditableValidationRule(rule) || isUploaderValidationRule(rule)) {
                    validationResult = rule.validate(value, { ctx: executorContext, options: options || {} })
                } else {
                    validationResult = rule.validate(componentId, { ctx: executorContext, options: options || {} })
                }

                if (!validationResult.isValid) {
                    newErrors.set(validaionSchemaId, { id: validaionSchemaId, ruleName, message: validationResult.message })
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
            componentErrors: $componentErrors,
            componentsSchemasModel: $componentsSchemasModel,
            readyComponentConditionalValidationRules: $readyComponentConditionalValidationRules,
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
