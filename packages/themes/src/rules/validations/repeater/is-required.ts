import { createRepeaterValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isEmpty } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
})

export const isRequiredRule = createRepeaterValidationRule<typeof optionsBuilder>({
    ruleName: 'isRequired',
    displayName: 'Обязательное поле',
    optionsBuilder,
    validate: (componentId, { ctx, options }) => {
        const { message } = options

        const children = ctx.getRepeaterChildIds(componentId)

        if (isEmpty(children)) {
            // set error
        }

        // skip
    },
})
