import { createComponentValidationRule, validationKeys } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isEmpty } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
})

export const isRequiredRule = createComponentValidationRule({
    key: validationKeys.isRequired,
    displayName: 'Обязательное поле',
    validate: ({ meta: { id } }, { ctx, options }) => {
        const { message } = options

        const children = ctx.getRepeaterChildIds(id)

        if (isEmpty(children)) {
            return { isValid: false, message }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
