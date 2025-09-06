import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import dayjs from 'dayjs'

import { validationErrors } from '../../../../consts'
import { isDateInputSchema } from '../../utils'

const optionsBuilder = builders.group({
    maxDate: builders.datePicker().label('Мин. дата').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxDateRule = createComponentValidationRule({
    key: 'maxDate',
    displayName: 'Минимальная дата',
    validate: (schema, { options }) => {
        if (!isDateInputSchema(schema)) {
            return null
        }

        const { message, maxDate } = options
        const errorMessage = message.replace('{maxDate}', maxDate.toString())

        const date = dayjs(schema.properties.value)
        if (date.isValid()) {
            return { isValid: false, message: validationErrors.invalidValue }
        }

        if (date.isAfter(maxDate)) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
