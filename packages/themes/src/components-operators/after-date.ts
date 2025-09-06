import { createComponentConditionOperator } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNumber, isString } from '@form-crafter/utils'
import dayjs from 'dayjs'

const optionsBuilder = builders.group({
    date: builders.datePicker().label('Дата').required(),
})

export const afterDateOperator = createComponentConditionOperator({
    key: 'afterDate',
    displayName: 'Значение даты должно быть после',
    execute: ({ properties }, { options }) => {
        const value = properties.value

        if (isString(value) || isNumber(value)) {
            return dayjs(value).isAfter(options.date)
        }

        return false
    },
    optionsBuilder,
})
