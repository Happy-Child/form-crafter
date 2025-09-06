import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotNull } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    minLength: builders.number().label('Мин. количество групп').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minLengthRule = createComponentValidationRule({
    key: 'minLength',
    displayName: 'Минимальное количество групп',
    validate: ({ meta: { id } }, { ctx, options }) => {
        const { message, minLength } = options
        const errorMessage = message.replace('{minLength}', minLength.toString())

        const children = ctx.getRepeaterChildIds(id)

        if (isNotNull(children) && children.length < minLength) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
