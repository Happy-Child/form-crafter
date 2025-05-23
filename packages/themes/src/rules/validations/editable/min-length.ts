import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isArray, isString, OptionalSerializableValue } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    minLength: builders.number().label('Мин. количество символов').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minLengthRule = createEditableValidationRule<OptionalSerializableValue, typeof optionsBuilder>({
    ruleName: 'minLengthRule',
    displayName: 'Минимальная длина',
    optionsBuilder,
    validate: (value, params) => {
        const { message, minLength } = params.options
        const errorMessage = message.replace('{minLength}', minLength.toString())

        if (isString(value) && value.trim().length > minLength) {
            // set error
        }

        if (isArray(value) && value.length > minLength) {
            // set error
        }

        // skip
    },
})
