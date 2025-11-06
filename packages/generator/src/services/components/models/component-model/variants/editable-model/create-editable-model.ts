import { EditableComponentProperties, EditableComponentSchema, EditableModel, SetSchemaPayload } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'

import { ComponentModelParams } from '../../types'
import { createComponentValidationModel } from '../component-validation-model'

type Params = Omit<ComponentModelParams, 'schema'> & {
    schema: EditableComponentSchema
}

export const createEditableModel = ({ schemaService, runMutations, componentsValidationErrorsModel, schema, ...params }: Params): EditableModel => {
    const validationIsAvailable = isNotEmpty(schema.validations?.schemas)
    const validationOnChangeIsAvailable = validationIsAvailable && schemaService.$additionalTriggers.getState().includes('onChange')
    const validationOnBlurIsAvailable = validationIsAvailable && schemaService.$additionalTriggers.getState().includes('onBlur')

    const $schema = createStore<EditableComponentSchema>(schema)
    const $componentId = combine($schema, (schema) => schema.meta.id)

    const onUpdateProperties = createEvent<Partial<EditableComponentProperties>>('onUpdateProperties')

    const onBlur = createEvent<void>('onBlur')

    const setSchema = createEvent<SetSchemaPayload>('setSchema')

    const valueBeChanged = createEvent('valueBeChanged')

    const changedFromHiddenToVisible = createEvent('changedFromHiddenToVisible')

    const runOnChangeValidation = createEvent('runOnChangeValidation')

    const runOnBlurValidation = createEvent('runOnBlurValidation')

    const validationComponentModel = createComponentValidationModel<EditableComponentSchema>({
        ...params,
        componentsValidationErrorsModel,
        $schema,
        $componentId,
        validationIsAvailable,
    })

    sample({
        source: $schema,
        clock: onUpdateProperties,
        fn: ({ meta }, data) => ({ id: meta.id, data }),
        target: runMutations,
    })

    sample({
        clock: setSchema,
        filter: ({ schema: newModel, isNewValue }) => {
            const isVisible = (newModel as EditableComponentSchema).visability?.hidden !== true
            return !!isNewValue && isVisible
        },
        target: valueBeChanged,
    })

    sample({
        source: $schema,
        clock: setSchema,
        filter: (curSchema, { schema: newModel }) => {
            const nowIsHidden = curSchema.visability?.hidden === true
            const nextIsVisability = (newModel as EditableComponentSchema).visability?.hidden !== true
            return nowIsHidden && nextIsVisability
        },
        target: changedFromHiddenToVisible,
    })

    sample({
        source: { componentId: $componentId, firstError: validationComponentModel.$firstError },
        clock: valueBeChanged,
        filter: ({ firstError }) => isNotEmpty(firstError),
        fn: ({ componentId }) => componentId,
        target: componentsValidationErrorsModel.removeAllComponentErrors,
    })

    if (validationOnChangeIsAvailable) {
        sample({
            clock: valueBeChanged,
            target: runOnChangeValidation,
        })
    }

    if (validationOnBlurIsAvailable) {
        sample({
            clock: onBlur,
            target: runOnBlurValidation,
        })
    }

    sample({
        source: $schema,
        clock: setSchema,
        fn: (schema, { schema: newSchema }) => ({
            ...schema,
            ...newSchema,
        }),
        target: $schema,
    })

    if (validationIsAvailable) {
        sample({
            source: validationComponentModel.$firstError,
            clock: changedFromHiddenToVisible,
            filter: isNotEmpty,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationOnChangeIsAvailable) {
        sample({
            clock: runOnChangeValidation,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationOnBlurIsAvailable) {
        sample({
            clock: runOnBlurValidation,
            target: validationComponentModel.runValidationFx,
        })
    }

    if (validationIsAvailable) {
        sample({
            source: { componentId: $componentId, firstError: validationComponentModel.$firstError },
            clock: validationComponentModel.runValidationFx.doneData,
            filter: ({ firstError }) => isNotEmpty(firstError),
            fn: ({ componentId }) => componentId,
            target: componentsValidationErrorsModel.removeComponentErrors,
        })

        sample({
            source: $componentId,
            clock: validationComponentModel.runValidationFx.failData,
            fn: (componentId, { errors }) => ({ componentId, errors }),
            target: componentsValidationErrorsModel.setComponentErrors,
        })
    }

    return {
        ...validationComponentModel,
        $schema,
        setSchema,
        onBlur,
        onUpdateProperties,
    }
}
