import { createComponentConditionOperator } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNumber, isString } from '@form-crafter/utils'
import dayjs from 'dayjs'

const optionsBuilder = builders.group({
    date: builders.datePicker().label('Дата').required(),
})

export const beforeDateOperator = createComponentConditionOperator({
    key: 'beforeDate',
    displayName: 'Значение даты должно быть до',
    execute: ({ properties }, { options }) => {
        const value = properties.value

        if (isString(value) || isNumber(value)) {
            return dayjs(value).isBefore(options.date)
        }

        return false
    },
    optionsBuilder,
})
