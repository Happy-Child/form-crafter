import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isBoolean, isEmpty, isNull, isString, Maybe, UniversalValue } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    skipNull: builders.checkbox().label('Разрешить null').nullable(),
    withTrim: builders.checkbox().label('Убрать лишние пробелы?').nullable(),
    message: builders.text().label('Текст ошибки').required(),
})

export const isRequiredRule = createEditableValidationRule<Maybe<UniversalValue | UniversalValue[]>, typeof optionsBuilder>({
    ruleName: 'isRequired',
    displayName: 'Обязательное поле',
    optionsBuilder,
    validate: (value, params) => {
        const { skipNull, withTrim, message } = params.options

        if (skipNull && isNull(value)) {
            // skip
        }

        if (withTrim && isString(value) && isEmpty(value.trim())) {
            // set error
        }

        if (isBoolean(value) && !value) {
            // set error
        }

        if (isEmpty(value)) {
            // set error
        }

        // skip
    },
})
