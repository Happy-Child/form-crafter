import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import dayjs from 'dayjs'

import { defaultDateFormat } from '../../consts'
import { isDateInputSchema } from '../../utils'

const optionsBuilder = builders.group({
    minDate: builders.datePicker().label('Мин. дата').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minDateRule = createComponentValidationRule({
    key: 'minDate',
    displayName: 'Минимальная дата',
    validate: (schema, { options }) => {
        if (!isDateInputSchema(schema)) {
            return null
        }

        const { message, minDate } = options
        const errorMessage = message.replace('{minDate}', minDate.toString())

        const date = dayjs(schema.properties.value, defaultDateFormat)
        if (!date.isValid() || date.isBefore(minDate)) {
            return { isValid: false, message: errorMessage }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
