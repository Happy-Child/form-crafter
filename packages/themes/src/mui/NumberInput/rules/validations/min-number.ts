import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'

import { isNumberInputSchema } from '../../utils'

const optionsBuilder = builders.group({
    minNumber: builders.number().label('Мин. число').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minNumberRule = createComponentValidationRule({
    key: 'minNumber',
    displayName: 'Мин. число',
    validate: (schema, params) => {
        if (!isNumberInputSchema(schema)) {
            return null
        }

        const {
            properties: { value },
        } = schema

        const { message, minNumber } = params.options
        const errorMessage = message.replace('{minNumber}', minNumber.toString())

        if (isNotEmpty(value) && value < minNumber) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
