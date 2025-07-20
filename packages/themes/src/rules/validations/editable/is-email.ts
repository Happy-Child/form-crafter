import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { Maybe } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
})

export const isEmailRule = createEditableValidationRule<Maybe<string>, typeof optionsBuilder>({
    ruleName: 'isEmail',
    displayName: 'Email',
    optionsBuilder,
    validate: (value, params) => {
        const { message } = params.options

        if (!value?.includes('@')) {
            return { isValid: false, message }
        }

        return { isValid: true }
    },
})
