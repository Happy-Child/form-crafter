import {
    ComponentValidationError,
    ComponentValidationResult,
    EditableComponentProperties,
    EditableComponentSchema,
    EntityId,
    isEditableValidationRule,
    isUploaderValidationRule,
    validationRuleNames,
} from '@form-crafter/core'
import { isEmpty, isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'
import { attach, combine, createEffect, createEvent, createStore, sample, UnitValue } from 'effector'
import { isEqual } from 'lodash-es'

import { EditableSchemaModel } from '../../../types'
import { extractComponentsSchemasModels } from '../../../utils'
import { ThemeService } from '../../theme'
import { ReadyValidationsRules } from '../types'
import { buildExecutorContext } from '../utils'
import { ComponentSchemaModelParams, RunValidationFxDone, RunValidationFxFail } from './types'

type RunValidationFxParams = {
    schema: EditableComponentSchema
    componentsSchemasModel: UnitValue<ComponentSchemaModelParams['$componentsSchemasModel']>
    readyConditionalValidationsRules: ReadyValidationsRules[keyof ReadyValidationsRules] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}

export type EditableSchemaModelParams = Omit<ComponentSchemaModelParams, 'schema'> & {
    schema: EditableComponentSchema
}

export const editableSchemaModel = ({
    $componentsSchemasModel,
    $readyConditionalValidationsRules: $readyConditionalValidationsRulesAll,
    $componentsValidationErrors,
    themeService,
    schema,
    additionalTriggers,
    runRelationsRulesEvent,
    updateComponentsValidationErrorsEvent,
    removeComponentValidationErrorsEvent,
}: EditableSchemaModelParams): EditableSchemaModel => {
    const validationsUserOptionsIsExists = isNotEmpty(schema.validations?.options)
    const validationOnChangeIsAvailable = validationsUserOptionsIsExists && additionalTriggers?.includes('onChange')
    const validationOnBlurIsAvailable = validationsUserOptionsIsExists && additionalTriggers?.includes('onBlur')

    const $schema = createStore<EditableComponentSchema>(schema)
    const $componentId = combine($schema, (schema) => schema.meta.id)

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

    const onUpdatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('onUpdatePropertiesEvent')

    const onBlurEvent = createEvent<void>('onBlurEvent')

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    const runOnChangeValidationEvent = createEvent('runOnChangeValidationEvent')

    const runOnBlurValidationEvent = createEvent('runOnBlurValidationEvent')

    const baseRunValidationFx = createEffect<RunValidationFxParams, RunValidationFxDone, RunValidationFxFail>(
        async ({ schema, componentsSchemasModel, readyConditionalValidationsRules, componentsValidationsRules }) => {
            if (!validationsUserOptionsIsExists) {
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

    if (validationsUserOptionsIsExists) {
        $isValidationPending.on(runValidationFx, () => true)
        $isValidationPending.on(runValidationFx.finally, () => false)
    }

    sample({
        source: $schema,
        clock: onUpdatePropertiesEvent,
        fn: ({ meta }, data) => ({ id: meta.id, data }),
        target: runRelationsRulesEvent,
    })

    if (validationOnChangeIsAvailable) {
        sample({
            source: $schema,
            clock: setModelEvent,
            filter: (curModel, newModel) => {
                const oldValue = curModel.properties.value
                const newValue = (newModel.properties as EditableComponentProperties).value

                // TODO Если uploader компонент и в value объект - что делать? Сравнить файлы как объекты не получиться
                const isChangedValue = !isEqual(oldValue, newValue)

                return isChangedValue && (newModel as EditableComponentSchema).visability?.hidden !== true
            },
            target: runOnChangeValidationEvent,
        })

        sample({
            clock: runOnChangeValidationEvent,
            target: runValidationFx,
        })
    }

    if (validationOnBlurIsAvailable) {
        sample({
            clock: onBlurEvent,
            target: runOnBlurValidationEvent,
        })

        sample({
            clock: runOnBlurValidationEvent,
            target: runValidationFx,
        })
    }

    sample({
        source: $schema,
        clock: setModelEvent,
        fn: (schema, newSchema) => ({
            ...schema,
            ...newSchema,
        }),
        target: $schema,
    })

    if (validationsUserOptionsIsExists) {
        sample({
            source: $componentId,
            clock: runValidationFx.doneData,
            fn: (componentId) => ({ componentId }),
            target: removeComponentValidationErrorsEvent,
        })
        sample({
            source: $componentId,
            clock: runValidationFx.failData,
            fn: (componentId, { errors }) => ({ componentId, errors }),
            target: updateComponentsValidationErrorsEvent,
        })
    }

    return {
        $schema,
        $errors,
        $error,
        $isRequired,
        $isValidationPending,
        setModelEvent,
        onBlurEvent,
        onUpdatePropertiesEvent,
        runValidationFx,
    }
}
