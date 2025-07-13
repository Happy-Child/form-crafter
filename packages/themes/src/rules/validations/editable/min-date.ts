import { createEditableValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNumber, isString, Maybe } from '@form-crafter/utils'
import dayjs from 'dayjs'

const optionsBuilder = builders.group({
    minDate: builders.datePicker().label('Мин. дата').required(),
    message: builders.text().label('Текст ошибки').required(),
})

export const minDateRule = createEditableValidationRule<Maybe<string | number>, typeof optionsBuilder>({
    ruleName: 'minDateRule',
    displayName: 'Минимальная дата',
    optionsBuilder,
    validate: (value, params) => {
        const { message, minDate } = params.options
        const errorMessage = message.replace('{minDate}', minDate.toString())

        if ((isString(value) || isNumber(value)) && dayjs(value).isBefore(minDate)) {
            return { isValid: false, error: { message: errorMessage } }
        }

        return { isValid: true }
    },
})
