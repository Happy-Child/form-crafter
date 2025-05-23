import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { Maybe } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
})

export const isEmailRule = createEditableValidationRule<Maybe<string>, typeof optionsBuilder>({
    ruleName: 'isEmailRule',
    displayName: 'Email',
    optionsBuilder,
    validate: (value, params) => {
        const { message } = params.options

        if (!value?.includes('@')) {
            // set error
        }

        // skip
    },
})
