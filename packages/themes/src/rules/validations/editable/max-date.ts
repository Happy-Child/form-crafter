import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNumber, isString, Maybe } from '@form-crafter/utils'
import dayjs from 'dayjs'

const optionsBuilder = builders.group({
    maxDate: builders.datePicker().label('Мин. дата').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const maxDateRule = createEditableValidationRule<Maybe<string | number>, typeof optionsBuilder>({
    ruleName: 'maxDateRule',
    displayName: 'Минимальная дата',
    optionsBuilder,
    validate: (value, params) => {
        const { message, maxDate } = params.options
        const errorMessage = message.replace('{maxDate}', maxDate.toString())

        if ((isString(value) || isNumber(value)) && dayjs(value).isAfter(maxDate)) {
            return { isValid: false, error: { message: errorMessage } }
        }

        return { isValid: true }
    },
})
