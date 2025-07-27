import {
    ComponentSchema,
    ComponentValidationError,
    ComponentValidationResult,
    EntityId,
    isEditableValidationRule,
    isUploaderValidationRule,
    validationRuleNames,
} from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createStore, Store, StoreWritable } from 'effector'

import { extractComponentsSchemasModels } from '../../../../utils'
import { buildExecutorContext, getPermanentValidationsSchemas } from '../../utils'
import { ComponentSchemaModelParams, RunComponentValidationFxDone, RunComponentValidationFxFail } from '../types'
import { RunComponentValidationFxParams } from './types'

type ComponentValidationModelParams<S extends ComponentSchema> = Pick<
    ComponentSchemaModelParams,
    '$componentsSchemasModel' | '$readyConditionalComponentsValidationRules' | '$componentsValidationErrors' | 'themeService'
> & {
    $componentId: Store<EntityId>
    $schema: StoreWritable<S>
    validationIsAvailable: boolean
}

export const createComponentValidationModel = <S extends ComponentSchema>({
    $componentsSchemasModel,
    $readyConditionalComponentsValidationRules,
    $componentsValidationErrors,
    $componentId,
    $schema,
    themeService,
    validationIsAvailable,
}: ComponentValidationModelParams<S>) => {
    const $isValidationPending = createStore<boolean>(false)

    const $errors = combine($componentsValidationErrors, $componentId, (componentsValidationErrors, componentId) => {
        const errors = componentsValidationErrors[componentId]
        return isNotEmpty(errors) ? errors : null
    })
    const $error = combine($errors, (errors) => (isNotEmpty(errors) ? errors[0] : null))

    const $readyConditionalValidationRules = combine(
        $readyConditionalComponentsValidationRules,
        $componentId,
        (readyConditionalValidationsRulesAll, componentId) => {
            const rules = readyConditionalValidationsRulesAll[componentId]
            return isNotEmpty(rules) ? rules : null
        },
    )
    const $readyPermanentValidationsRules = combine($schema, (schema) => getPermanentValidationsSchemas(schema.validations?.schemas || []))

    const $isRequired = combine(
        $readyConditionalValidationRules,
        $readyPermanentValidationsRules,
        (readyConditionalValidationRules, readyPermanentValidationsRules) => {
            const readyByIsRequired = new Set([
                ...(readyConditionalValidationRules?.readyGroupedByRuleName?.[validationRuleNames.isRequired] || new Set()),
                ...(readyPermanentValidationsRules?.readyGroupedByRuleName?.[validationRuleNames.isRequired] || new Set()),
            ])

            if (isNotEmpty(readyByIsRequired) && readyByIsRequired.size !== 0) {
                return true
            }

            return false
        },
    )

    const baseRunValidationFx = createEffect<RunComponentValidationFxParams<S>, RunComponentValidationFxDone, RunComponentValidationFxFail>(
        async ({ schema, componentsSchemasModel, readyConditionalValidationRules, componentsValidationsRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const value = schema.properties.value
            const componentId = schema.meta.id

            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const executorContext = buildExecutorContext({ componentsSchemas })

            const errors: ComponentValidationError[] = []

            for (const validationSchema of schema.validations?.schemas || []) {
                const { id: validaionSchemaId, ruleName, options, condition } = validationSchema

                const ruleIsReady = isNotEmpty(condition) ? readyConditionalValidationRules?.readyBySchemaId?.has(validaionSchemaId) : true
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
                    errors.push({ id: validaionSchemaId, ruleName, message: validationResult.message })
                }
            }

            if (isNotEmpty(errors)) {
                return Promise.reject({
                    errors,
                })
            }

            return Promise.resolve()
        },
    )
    const runValidationFx = attach({
        source: {
            schema: $schema,
            componentsSchemasModel: $componentsSchemasModel,
            readyConditionalValidationRules: $readyConditionalValidationRules,
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
        $errors,
        $error,
        $isRequired,
        $isValidationPending,
        validationIsAvailable,
    }
}
