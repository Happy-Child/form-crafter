import { createEditableValidationRule, validationRuleNames } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isBoolean, isEmpty, isNull, isString, Maybe, UniversalValue } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    skipNull: builders.checkbox().label('Разрешить null').nullable(),
    withTrim: builders.checkbox().label('Убрать лишние пробелы?').nullable(),
    message: builders.text().label('Текст ошибки').required(),
})

export const isRequiredRule = createEditableValidationRule<Maybe<UniversalValue | UniversalValue[]>, typeof optionsBuilder>({
    ruleName: validationRuleNames.isRequired,
    displayName: 'Обязательное поле',
    optionsBuilder,
    validate: (value, params) => {
        const { skipNull, withTrim, message } = params.options

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
})
