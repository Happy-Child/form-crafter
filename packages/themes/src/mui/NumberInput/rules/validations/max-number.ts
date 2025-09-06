import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'

import { isNumberInputSchema } from '../../utils'

const optionsBuilder = builders.group({
    maxNumber: builders.number().label('Макс. число').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxNumberRule = createComponentValidationRule({
    key: 'maxNumber',
    displayName: 'Макс. число',
    validate: (schema, params) => {
        if (!isNumberInputSchema(schema)) {
            return null
        }

        const {
            properties: { value },
        } = schema

        const { message, maxNumber } = params.options
        const errorMessage = message.replace('{maxNumber}', maxNumber.toString())

        if (isNotEmpty(value) && value > maxNumber) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
