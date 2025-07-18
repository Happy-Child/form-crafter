import {
    EditableComponentProperties,
    EditableComponentSchema,
    EntityId,
    isEditableValidationRule,
    isUploaderValidationRule,
    ValidationRuleComponentError,
    ValidationRuleComponentResult,
    validationRuleNames,
} from '@form-crafter/core'
import { isEmpty, isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample, UnitValue } from 'effector'
import { isEqual } from 'lodash-es'

import { EditableSchemaModel } from '../../../types'
import { getComponentsSchemasFromModels } from '../../../utils'
import { buildExecutorContext } from '../utils'
import { ComponentSchemaModelParams } from './types'

export type EditableSchemaModelParams = Omit<ComponentSchemaModelParams, 'schema'> & {
    schema: EditableComponentSchema
}

export const editableSchemaModel = ({
    $componentsSchemasModel,
    $readyConditionalValidationsRules,
    themeService,
    schema,
    runRelationsRulesEvent,
    additionalTriggers,
}: EditableSchemaModelParams): EditableSchemaModel => {
    const validationUserOptionsIsExists = isNotEmpty(schema.validations?.options)
    const { onBlurValidationTrigger, onChangeValidationTrigger } = {
        onBlurValidationTrigger: additionalTriggers?.includes('onBlur'),
        onChangeValidationTrigger: additionalTriggers?.includes('onChange'),
    }

    const $schema = createStore<EditableComponentSchema>(schema)

    const $error = createStore<ValidationRuleComponentError | null>(null)

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
        $schema,
        $readyConditionalValidationsRules,
        $readyPermanentValidationsRules,
        (schema, readyConditionalValidationsRules, readyPermanentValidationsRules) => {
            const readyByIsRequired = new Set([
                ...(readyConditionalValidationsRules[schema.meta.id]?.readyGroupedByRuleName?.[validationRuleNames.isRequired] || new Set()),
                ...(readyPermanentValidationsRules?.readyGroupedByRuleName?.[validationRuleNames.isRequired] || new Set()),
            ])

            if (isNotEmpty(readyByIsRequired) && readyByIsRequired.size !== 0) {
                return true
            }

            return false
        },
    )

    const setPropertiesEvent = createEvent<Partial<EditableComponentProperties>>('setPropertiesEvent')

    const updatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('updatePropertiesEvent')

    const onBlurEvent = createEvent<void>('onBlurEvent')

    const setModelEvent = createEvent<OptionalSerializableObject>('setModelEvent')

    const runValidationEvent = createEvent('runValidationEvent')

    const runOnChangeValidationEvent = createEvent('runOnChangeValidationEvent')

    // const runOnBlurValidationEvent = createEvent('runOnBlurValidationEvent')

    $schema.on(setPropertiesEvent, (schema, newProperties) => ({
        ...schema,
        properties: {
            ...schema.properties,
            ...newProperties,
        },
    }))

    sample({
        source: $schema,
        clock: updatePropertiesEvent,
        fn: ({ meta }, data) => ({ id: meta.id, data }),
        target: runRelationsRulesEvent,
    })

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
        source: $schema,
        clock: setModelEvent,
        fn: (schema, newSchema) => ({
            ...schema,
            ...newSchema,
        }),
        target: $schema,
    })

    if (validationUserOptionsIsExists && onChangeValidationTrigger) {
        const executeValidationOnChangeEvent = sample({
            source: {
                model: $schema,
                componentsSchemasModel: $componentsSchemasModel,
                readyConditionalValidationsRules: $readyConditionalValidationsRules,
                componentsValidationsRules: themeService.$componentsValidationsRules,
            },
            clock: runOnChangeValidationEvent,
            fn: ({ model, componentsSchemasModel, readyConditionalValidationsRules, componentsValidationsRules }) => {
                const componentsSchemas = getComponentsSchemasFromModels(componentsSchemasModel)
                const executorContext = buildExecutorContext({ componentsSchemas })

                let error: UnitValue<typeof $error> = null

                const componentId = model.meta.id
                const value = model.properties.value

                for (const userOption of model.validations?.options || []) {
                    const { id: validaionSchemaId, ruleName, options, condition } = userOption

                    const ruleIsReady = isNotEmpty(condition) ? readyConditionalValidationsRules[model.meta.id]?.readyBySchemaId?.has(validaionSchemaId) : true
                    if (!ruleIsReady) {
                        continue
                    }

                    let validationResult: ValidationRuleComponentResult

                    const rule = componentsValidationsRules[ruleName]

                    if (isEditableValidationRule(rule) || isUploaderValidationRule(rule)) {
                        validationResult = rule.validate(value, { ctx: executorContext, options: options || {} })
                    } else {
                        validationResult = rule.validate(componentId, { ctx: executorContext, options: options || {} })
                    }

                    if (!validationResult.isValid) {
                        error = validationResult.error
                        break
                    }
                }

                return {
                    error,
                }
            },
        })

        sample({
            clock: executeValidationOnChangeEvent,
            fn: ({ error }) => error,
            target: $error,
        })
    }

    if (validationUserOptionsIsExists && onBlurValidationTrigger) {
        // sample({
        //     clock: onBlurEvent,
        //     target: runOnBlurValidationEvent,
        // })
        // sample({
        //     source: $schema,
        //     clock: runOnBlurValidationEvent,
        //     fn: ({ validations }) => {
        //         //
        //     },
        //     target: any,
        // })
    }

    // ОТДЕЛЬНЯА ФАБРИКА НА ВАЛИДАЦИЮ
    // Если не передат доп. триггеры onChange/onBlur - не нужно переренлеривать форму каждый раз изменяя состояние isValid.
    // Когда RESET ERROR

    // 1. Перед onSubmit валидацией сбросить ошибку поля
    // 2. Перед onChange/blur валидацией сбросить ошибку поля

    return {
        $schema,
        $error,
        $isRequired,
        setModelEvent,
        onUpdatePropertiesEvent: updatePropertiesEvent,
        onBlurEvent,
        onSetPropertiesEvent: setPropertiesEvent,
        runValidationEvent,
    }
}
