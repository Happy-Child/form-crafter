import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotNull } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    maxLength: builders.number().label('Макс. количество групп').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxLengthRule = createComponentValidationRule({
    key: 'maxLength',
    displayName: 'Минимальное количество групп',
    validate: ({ meta: { id } }, { ctx, options }) => {
        const { message, maxLength } = options
        const errorMessage = message.replace('{maxLength}', maxLength.toString())

        const children = ctx.getRepeaterChildIds(id)

        if (isNotNull(children) && children.length > maxLength) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
