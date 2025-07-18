import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty, Maybe } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    minNumber: builders.number().label('Мин. число').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minNumberRule = createEditableValidationRule<Maybe<number>, typeof optionsBuilder>({
    ruleName: 'minNumber',
    displayName: 'Мин. число',
    optionsBuilder,
    validate: (value, params) => {
        const { message, minNumber } = params.options
        const errorMessage = message.replace('{minNumber}', minNumber.toString())

        if (isNotEmpty(value) && value < minNumber) {
            return { isValid: false, error: { message: errorMessage } }
        }

        return { isValid: true }
    },
})
