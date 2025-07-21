import { EditableComponentProperties, EditableComponentSchema } from '@form-crafter/core'
import { isNotEmpty, OptionalSerializableObject } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'

import { EditableSchemaModel } from '../../../../types'
import { ComponentSchemaModelParams } from '../types'
import { isChangedValue } from '../utils'
import { createValidationComponentModel } from '../validations-component-model'

export type EditableSchemaModelParams = Omit<ComponentSchemaModelParams, 'schema'> & {
    schema: EditableComponentSchema
}

export const createEditableSchemaModel = ({
    schema,
    additionalTriggers,
    runRelationsRulesEvent,
    updateComponentsValidationErrorsEvent,
    removeComponentValidationErrorsEvent,
    ...params
}: EditableSchemaModelParams): EditableSchemaModel => {
    const validationIsAvailable = isNotEmpty(schema.validations?.options)
    const validationOnChangeIsAvailable = validationIsAvailable && additionalTriggers?.includes('onChange')
    const validationOnBlurIsAvailable = validationIsAvailable && additionalTriggers?.includes('onBlur')

    const $schema = createStore<EditableComponentSchema>(schema)
    const $componentId = combine($schema, (schema) => schema.meta.id)

    const onUpdatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('onUpdatePropertiesEvent')

    const onBlurEvent = createEvent<void>('onBlurEvent')

    const setSchemaEvent = createEvent<OptionalSerializableObject>('setSchemaEvent')

    const runOnChangeValidationEvent = createEvent('runOnChangeValidationEvent')

    const runOnBlurValidationEvent = createEvent('runOnBlurValidationEvent')

    const validationComponentModel = createValidationComponentModel<EditableComponentSchema>({ ...params, $schema, $componentId, validationIsAvailable })

    sample({
        source: $schema,
        clock: onUpdatePropertiesEvent,
        fn: ({ meta }, data) => ({ id: meta.id, data }),
        target: runRelationsRulesEvent,
    })

    if (validationOnChangeIsAvailable) {
        sample({
            source: $schema,
            clock: setSchemaEvent,
            filter: (curModel, newModel) => {
                const oldValue = curModel.properties.value
                const newValue = (newModel.properties as EditableComponentProperties).value
                return isChangedValue(oldValue, newValue) && (newModel as EditableComponentSchema).visability?.hidden !== true
            },
            target: runOnChangeValidationEvent,
        })

        sample({
            clock: runOnChangeValidationEvent,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationOnBlurIsAvailable) {
        sample({
            clock: onBlurEvent,
            target: runOnBlurValidationEvent,
        })

        sample({
            clock: runOnBlurValidationEvent,
            target: validationComponentModel.runValidationFx,
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
            source: $componentId,
            clock: validationComponentModel.runValidationFx.doneData,
            fn: (componentId) => ({ componentId }),
            target: removeComponentValidationErrorsEvent,
        })
        sample({
            source: $componentId,
            clock: validationComponentModel.runValidationFx.failData,
            fn: (componentId, { errors }) => ({ componentId, errors }),
            target: updateComponentsValidationErrorsEvent,
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
