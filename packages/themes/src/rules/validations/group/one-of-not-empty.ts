import { createGroupValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    // TODO добавить .relations() на связь formMessage и componentMessage - одно из них обязательно.
    formMessage: builders.text().label('Текст ошибки формы'),
    componentMessage: builders.text().label('Текст ошибки компонента').required(),
    oneOfFields: builders.selectComponents().label('Поля формы').required(),
})

export const oneOfNotEmptyRule = createGroupValidationRule<typeof optionsBuilder>({
    ruleName: 'oneOfNotEmpty',
    displayName: 'Одно из полей обязательно',
    optionsBuilder,
    validate: ({ options, ctx }) => {
        const { oneOfFields, componentMessage, formMessage } = options

        const someoneNotEmpty = oneOfFields.some((componentId) => {
            const schema = ctx.getComponentSchemaById(componentId)

            if (isNotEmpty(schema) && isNotEmpty(schema.properties.value)) {
                return true
            }

            return false
        }, [])

        if (!someoneNotEmpty) {
            const componentsErrors = oneOfFields.map((componentId) => ({ componentId, message: componentMessage }))

            let finalFormMessage = formMessage
            if (isNotEmpty(finalFormMessage)) {
                const componentsLabels = componentsErrors
                    .map(({ componentId }) => {
                        const label = ctx.getComponentSchemaById(componentId)?.properties?.label
                        return label ? `"${label}"` : null
                    })
                    .filter(isNotEmpty)
                    .join(', ')

                finalFormMessage = finalFormMessage.replace('{componentLabels}', componentsLabels)
            }

            return { isValid: false, message: finalFormMessage, componentsErrors }
        }

        return { isValid: true }
    },
})
