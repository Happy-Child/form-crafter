import {
    ComponentSchema,
    ComponentValidationError,
    ComponentValidationResult,
    EntityId,
    isEditableValidationRule,
    isUploaderValidationRule,
    validationRuleNames,
} from '@form-crafter/core'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'
import { attach, combine, createEffect, createStore, Store, StoreWritable } from 'effector'

import { extractComponentsSchemasModels } from '../../../../utils'
import { buildExecutorContext } from '../../utils'
import { ComponentSchemaModelParams, RunValidationFxDone, RunValidationFxFail } from '../types'
import { RunValidationFxParams } from './types'

type ValidationComponentModelParams<S extends ComponentSchema> = Pick<
    ComponentSchemaModelParams,
    '$componentsSchemasModel' | '$readyConditionalValidationsRules' | '$componentsValidationErrors' | 'themeService'
> & {
    $componentId: Store<EntityId>
    $schema: StoreWritable<S>
    validationIsAvailable: boolean
}

export const createValidationComponentModel = <S extends ComponentSchema>({
    $componentsSchemasModel,
    $readyConditionalValidationsRules: $readyConditionalValidationsRulesAll,
    $componentsValidationErrors,
    $componentId,
    $schema,
    themeService,
    validationIsAvailable,
}: ValidationComponentModelParams<S>) => {
    const $isValidationPending = createStore<boolean>(false)

    const $errors = combine($componentsValidationErrors, $componentId, (componentsValidationErrors, componentId) => {
        const errors = componentsValidationErrors[componentId]
        return isNotEmpty(errors) ? errors : null
    })
    const $error = combine($errors, (errors) => (isNotEmpty(errors) ? errors[0] : null))

    const $readyConditionalValidationsRules = combine(
        $readyConditionalValidationsRulesAll,
        $componentId,
        (readyConditionalValidationsRulesAll, componentId) => {
            const rules = readyConditionalValidationsRulesAll[componentId]
            return isNotEmpty(rules) ? rules : null
        },
    )
    const $readyPermanentValidationsRules = combine($schema, (schema) => {
        const readyBySchemaId = new Set<EntityId>()
        const readyGroupedByRuleName: Record<string, Set<EntityId>> = {}

        if (isNotEmpty(schema.validations?.options)) {
            for (const validation of schema.validations.options) {
                if (isEmpty(validation.condition)) {
                    readyBySchemaId.add(validation.id)

                    if (!readyGroupedByRuleName[validation.ruleName]) {
                        readyGroupedByRuleName[validation.ruleName] = new Set()
                    }
                    readyGroupedByRuleName[validation.ruleName].add(validation.id)
                }
            }
        }

        return { readyBySchemaId, readyGroupedByRuleName }
    })

    const $isRequired = combine(
        $readyConditionalValidationsRules,
        $readyPermanentValidationsRules,
        (readyConditionalValidationsRules, readyPermanentValidationsRules) => {
            const readyByIsRequired = new Set([
                ...(readyConditionalValidationsRules?.readyGroupedByRuleName?.[validationRuleNames.isRequired] || new Set()),
                ...(readyPermanentValidationsRules?.readyGroupedByRuleName?.[validationRuleNames.isRequired] || new Set()),
            ])

            if (isNotEmpty(readyByIsRequired) && readyByIsRequired.size !== 0) {
                return true
            }

            return false
        },
    )

    const baseRunValidationFx = createEffect<RunValidationFxParams<S>, RunValidationFxDone, RunValidationFxFail>(
        async ({ schema, componentsSchemasModel, readyConditionalValidationsRules, componentsValidationsRules }) => {
            if (!validationIsAvailable) {
                return Promise.resolve()
            }

            const componentId = schema.meta.id
            const componentsSchemas = extractComponentsSchemasModels(componentsSchemasModel)
            const executorContext = buildExecutorContext({ componentsSchemas })

            const errors: ComponentValidationError[] = []

            const value = schema.properties.value

            for (const userValidationOption of schema.validations?.options || []) {
                const { id: validaionSchemaId, ruleName, options, condition } = userValidationOption

                const ruleIsReady = isNotEmpty(condition) ? readyConditionalValidationsRules?.readyBySchemaId?.has(validaionSchemaId) : true
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
            readyConditionalValidationsRules: $readyConditionalValidationsRules,
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
