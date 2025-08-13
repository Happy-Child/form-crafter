import { EditableComponentProperties, EditableComponentSchema } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'

import { createComponentValidationModel } from '../component-validation-model'
import { ComponentModelParams, EditableModel } from '../types'
import { isChangedValue } from '../utils'

type Params = Omit<ComponentModelParams, 'schema'> & {
    schema: EditableComponentSchema
}

export const createEditableModel = ({ schema, additionalTriggers, runMutationsRulesEvent, validationsErrorsModel, ...params }: Params): EditableModel => {
    const validationIsAvailable = isNotEmpty(schema.validations?.schemas)
    const validationOnChangeIsAvailable = validationIsAvailable && additionalTriggers?.includes('onChange')
    const validationOnBlurIsAvailable = validationIsAvailable && additionalTriggers?.includes('onBlur')

    const $schema = createStore<EditableComponentSchema>(schema)
    const $componentId = combine($schema, (schema) => schema.meta.id)

    const onUpdatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('onUpdatePropertiesEvent')

    const onBlurEvent = createEvent<void>('onBlurEvent')

    const setSchemaEvent = createEvent<OptionalSerializableObject>('setSchemaEvent')

    const valueBeChangedEvent = createEvent('valueBeChangedEvent')

    const changedFromHiddenToVisibleEvent = createEvent('changedFromHiddenToVisibleEvent')

    const runOnChangeValidationEvent = createEvent('runOnChangeValidationEvent')

    const runOnBlurValidationEvent = createEvent('runOnBlurValidationEvent')

    const validationComponentModel = createComponentValidationModel<EditableComponentSchema>({
        ...params,
        validationsErrorsModel,
        $schema,
        $componentId,
        validationIsAvailable,
    })

    sample({
        source: $schema,
        clock: onUpdatePropertiesEvent,
        fn: ({ meta }, data) => ({ id: meta.id, data }),
        target: runMutationsRulesEvent,
    })

    sample({
        source: $schema,
        clock: setSchemaEvent,
        filter: (curModel, newModel) => {
            const oldValue = curModel.properties.value
            const newValue = (newModel.properties as EditableComponentProperties).value
            const isVisible = (newModel as EditableComponentSchema).visability?.hidden !== true
            return isChangedValue(oldValue, newValue) && isVisible
        },
        target: valueBeChangedEvent,
    })

    sample({
        source: $schema,
        clock: setSchemaEvent,
        filter: (curModel, newModel) => {
            const nowIsHidden = curModel.visability?.hidden === true
            const nextIsVisability = (newModel as EditableComponentSchema).visability?.hidden !== true
            return nowIsHidden && nextIsVisability
        },
        target: changedFromHiddenToVisibleEvent,
    })

    sample({
        source: { componentId: $componentId, firstError: validationComponentModel.$firstError },
        clock: valueBeChangedEvent,
        filter: ({ firstError }) => isNotEmpty(firstError),
        fn: ({ componentId }) => componentId,
        target: validationsErrorsModel.removeAllErrorsEvent,
    })

    if (validationOnChangeIsAvailable) {
        sample({
            clock: valueBeChangedEvent,
            target: runOnChangeValidationEvent,
        })
    }

    if (validationOnBlurIsAvailable) {
        sample({
            clock: onBlurEvent,
            target: runOnBlurValidationEvent,
        })
    }

    sample({
        source: $schema,
        clock: setSchemaEvent,
        fn: (schema, newSchema) => ({
            ...schema,
            ...newSchema,
        }),
        target: $schema,
    })

    if (validationIsAvailable) {
        sample({
            source: validationComponentModel.$firstError,
            clock: changedFromHiddenToVisibleEvent,
            filter: isNotEmpty,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationOnChangeIsAvailable) {
        // TODO вызывается ли гарантированно после вышестоящего sample?
        // Если нет, то combineEvents runOnChangeValidationEvent + $schema.update решит проблему?
        sample({
            clock: runOnChangeValidationEvent,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationOnBlurIsAvailable) {
        sample({
            clock: runOnBlurValidationEvent,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationIsAvailable) {
        sample({
            source: { componentId: $componentId, firstError: validationComponentModel.$firstError },
            clock: validationComponentModel.runValidationFx.doneData,
            filter: ({ firstError }) => isNotEmpty(firstError),
            fn: ({ componentId }) => componentId,
            target: validationsErrorsModel.removeComponentErrorsEvent,
        })
        sample({
            source: $componentId,
            clock: validationComponentModel.runValidationFx.failData,
            fn: (componentId, { errors }) => ({ componentId, errors }),
            target: validationsErrorsModel.setComponentErrorsEvent,
        })
    }

    return {
        ...validationComponentModel,
        $schema,
        setSchemaEvent,
        onBlurEvent,
        onUpdatePropertiesEvent,
    }
}
