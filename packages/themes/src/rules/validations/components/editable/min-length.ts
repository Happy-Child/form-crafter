import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isArray, isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    minLength: builders.number().label('Мин. количество символов').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minLengthRule = createComponentValidationRule({
    key: 'minLength',
    displayName: 'Минимальная длина',
    validate: ({ properties: { value } }, { options }) => {
        const { message, minLength } = options
        const errorMessage = message.replace('{minLength}', minLength.toString())

        if (isString(value) && value.trim().length < minLength) {
            return { isValid: false, message: errorMessage }
        }

        if (isArray(value) && value.length < minLength) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
