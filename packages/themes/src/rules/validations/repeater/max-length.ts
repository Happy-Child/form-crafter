import { createRepeaterValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotNull } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    maxLength: builders.number().label('Макс. количество групп').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxLengthRule = createRepeaterValidationRule<typeof optionsBuilder>({
    ruleName: 'maxLengthRule',
    displayName: 'Минимальное количество групп',
    optionsBuilder,
    validate: (componentId, { ctx, options }) => {
        const { message, maxLength } = options
        const errorMessage = message.replace('{maxLength}', maxLength.toString())

        const children = ctx.getRepeaterChildIds(componentId)

        if (isNotNull(children) && children.length > maxLength) {
            // set error
        }

        // skip
    },
})
