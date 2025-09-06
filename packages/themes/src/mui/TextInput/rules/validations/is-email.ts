import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

import { isTextInputSchema } from '../../utils'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
})

export const isEmailRule = createComponentValidationRule({
    key: 'isEmail',
    displayName: 'Email',
    validate: (schema, params) => {
        if (!isTextInputSchema(schema)) {
            return null
        }

        const { message } = params.options

        if (!schema.properties.value.includes('@')) {
            return { isValid: false, message }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
