import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNumber, isString } from '@form-crafter/utils'
import dayjs from 'dayjs'

import { validationErrors } from '../../../../consts'
import { defaultDateFormat } from '../../consts'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки'),
})

export const isDateRule = createComponentValidationRule({
    key: 'isDate',
    displayName: 'Дата',
    validate: (schema, { options }) => {
        if (!isString(schema.properties.value) && !isNumber(schema.properties.value)) {
            return null
        }

        const errorMessage = options.message || validationErrors.invalidValue

        const date = dayjs(schema.properties.value, defaultDateFormat)
        if (!date.isValid()) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
