import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isArray, isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    maxLength: builders.number().label('Макс. количество символов').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxLengthRule = createComponentValidationRule({
    key: 'maxLength',
    displayName: 'Минимальная длина',
    validate: ({ properties: { value } }, { options }) => {
        const { message, maxLength } = options
        const errorMessage = message.replace('{maxLength}', maxLength.toString())

        if (isString(value) && value.trim().length > maxLength) {
            return { isValid: false, message: errorMessage }
        }

        if (isArray(value) && value.length > maxLength) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
