import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty, Maybe } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    maxNumber: builders.number().label('Макс. число').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxNumberRule = createEditableValidationRule<Maybe<number>, typeof optionsBuilder>({
    ruleName: 'maxNumber',
    displayName: 'Макс. число',
    optionsBuilder,
    validate: (value, params) => {
        const { message, maxNumber } = params.options
        const errorMessage = message.replace('{maxNumber}', maxNumber.toString())

        if (isNotEmpty(value) && value > maxNumber) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
})
