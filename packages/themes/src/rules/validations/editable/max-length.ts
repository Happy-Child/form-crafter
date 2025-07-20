import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isArray, isString, OptionalSerializableValue } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    maxLength: builders.number().label('Макс. количество символов').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxLengthRule = createEditableValidationRule<OptionalSerializableValue, typeof optionsBuilder>({
    ruleName: 'maxLength',
    displayName: 'Минимальная длина',
    optionsBuilder,
    validate: (value, params) => {
        const { message, maxLength } = params.options
        const errorMessage = message.replace('{maxLength}', maxLength.toString())

        if (isString(value) && value.trim().length > maxLength) {
            return { isValid: false, message: errorMessage }
        }

        if (isArray(value) && value.length > maxLength) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
})
