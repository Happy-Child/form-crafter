import { createComponentValidationRule, validationKeys } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isEmpty, isNull } from '@form-crafter/utils'

import { isDateRangeSchema } from '../../utils'

const optionsBuilder = builders.group({
    skipNull: builders.checkbox().label('Разрешить null').nullable(),
    message: builders.text().label('Текст ошибки').required(),
})

export const isRequiredRule = createComponentValidationRule({
    key: validationKeys.isRequired,
    displayName: 'Обязательное поле',
    validate: (schema, params) => {
        if (!isDateRangeSchema(schema)) {
            return null
        }

        const {
            properties: { value },
        } = schema

        const { skipNull, message } = params.options

        if (skipNull && isNull(value)) {
            return { isValid: true }
        }

        if (isEmpty(value?.start) || isEmpty(value?.end)) {
            return { isValid: false, message }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
