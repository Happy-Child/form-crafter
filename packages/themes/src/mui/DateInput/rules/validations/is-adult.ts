import { createComponentValidationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNumber, isString } from '@form-crafter/utils'
import dayjs from 'dayjs'

import { defaultDateFormat } from '../../consts'

const optionsBuilder = builders.group({
    message: builders.text().label('Текст ошибки').required(),
})

export const isAdultRule = createComponentValidationRule({
    key: 'isAdult',
    displayName: 'Есть 18 лет',
    validate: (schema, { options }) => {
        if (!isString(schema.properties.value) && !isNumber(schema.properties.value)) {
            return null
        }

        const { message } = options

        const date = dayjs(schema.properties.value, defaultDateFormat)
        const targetDay = dayjs().subtract(18, 'years')
        if (!date.isValid() || targetDay.isBefore(date)) {
            return { isValid: false, message }
        }

        return { isValid: true }
    },
    optionsBuilder,
})
