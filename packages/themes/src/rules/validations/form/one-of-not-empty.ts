import { createFormValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isEmpty, isNotEmpty } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
    oneOfFields: builders.selectComponents().label('Поля формы').required(),
})

export const oneOfNotEmptyRule = createFormValidationRule<typeof optionsBuilder>({
    ruleName: 'oneOfNotEmpty',
    displayName: 'Одно из полей обязательно к заполнению',
    optionsBuilder,
    validate: (componentsSchemas, { options }) => {
        const { oneOfFields, message } = options

        const invalidFieldsIds = oneOfFields.reduce<string[]>((result, componentId) => {
            if (isEmpty(componentsSchemas[componentId].properties.value)) {
                return [...result, componentId]
            }
            return result
        }, [])

        if (isNotEmpty(invalidFieldsIds)) {
            return invalidFieldsIds.reduce(
                (map, componentId) => ({
                    ...map,
                    [componentId]: {
                        isValid: false,
                        error: { message },
                    },
                }),
                {},
            )
        }

        return {}
    },
})
