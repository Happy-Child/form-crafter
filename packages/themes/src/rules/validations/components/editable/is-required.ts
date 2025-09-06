import { createComponentValidationRule, validationKeys } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isBoolean, isEmpty, isNull, isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    skipNull: builders.checkbox().label('Разрешить null').nullable(),
    withTrim: builders.checkbox().label('Убрать лишние пробелы?').nullable(),
    message: builders.text().label('Текст ошибки').required(),
})

export const isRequiredRule = createComponentValidationRule({
    key: validationKeys.isRequired,
    displayName: 'Обязательное поле',
    validate: ({ properties: { value } }, { options }) => {
        const { skipNull, withTrim, message } = options

        if (skipNull && isNull(value)) {
            return { isValid: true }
        }

        if (withTrim && isString(value) && isEmpty(value.trim())) {
            return { isValid: false, message }
        }

        if (isBoolean(value) && !value) {
            return { isValid: false, message }
        }

        if (isEmpty(value)) {
            return { isValid: false, message }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
