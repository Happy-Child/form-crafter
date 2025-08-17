import { EditableComponentProperties, EditableComponentSchema } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { combine, createEvent, createStore, sample } from 'effector'

import { createComponentValidationModel } from '../component-validation-model'
import { ComponentModelParams, EditableModel, SetSchemaPayload } from '../types'

type Params = Omit<ComponentModelParams, 'schema'> & {
    schema: EditableComponentSchema
}

export const createEditableModel = ({
    schema,
    additionalTriggers,
    runMutationsRulesEvent,
    componentsValidationErrorsModel,
    ...params
}: Params): EditableModel => {
    const validationIsAvailable = isNotEmpty(schema.validations?.schemas)
    const validationOnChangeIsAvailable = validationIsAvailable && additionalTriggers?.includes('onChange')
    const validationOnBlurIsAvailable = validationIsAvailable && additionalTriggers?.includes('onBlur')

    const $schema = createStore<EditableComponentSchema>(schema)
    const $componentId = combine($schema, (schema) => schema.meta.id)

    const onUpdatePropertiesEvent = createEvent<Partial<EditableComponentProperties>>('onUpdatePropertiesEvent')

    const onBlurEvent = createEvent<void>('onBlurEvent')

    const setSchemaEvent = createEvent<SetSchemaPayload>('setSchemaEvent')

    const valueBeChangedEvent = createEvent('valueBeChangedEvent')

    const changedFromHiddenToVisibleEvent = createEvent('changedFromHiddenToVisibleEvent')

    const runOnChangeValidationEvent = createEvent('runOnChangeValidationEvent')

    const runOnBlurValidationEvent = createEvent('runOnBlurValidationEvent')

    const validationComponentModel = createComponentValidationModel<EditableComponentSchema>({
        ...params,
        componentsValidationErrorsModel,
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
        clock: setSchemaEvent,
        filter: ({ schema: newModel, isNewValue }) => {
            const isVisible = (newModel as EditableComponentSchema).visability?.hidden !== true
            return !!isNewValue && isVisible
        },
        target: valueBeChangedEvent,
    })

    sample({
        source: $schema,
        clock: setSchemaEvent,
        filter: (curSchema, { schema: newModel }) => {
            const nowIsHidden = curSchema.visability?.hidden === true
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
        target: componentsValidationErrorsModel.removeAllErrorsEvent,
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
        fn: (schema, { schema: newSchema }) => ({
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
            target: componentsValidationErrorsModel.removeComponentErrorsEvent,
        })

        sample({
            source: $componentId,
            clock: validationComponentModel.runValidationFx.failData,
            fn: (componentId, { errors }) => ({ componentId, errors }),
            target: componentsValidationErrorsModel.setComponentErrorsEvent,
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
