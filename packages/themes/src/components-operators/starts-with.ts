import { createComponentConditionOperator } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    startsWith: builders.text().label('Значение').required(),
})

export const startsWithOperator = createComponentConditionOperator({
    key: 'startsWith',
    displayName: 'Начинается c',
    execute: ({ properties }, { options }) => {
        const value = properties.value

        if (isString(value)) {
            return value.startsWith(options.startsWith)
        }

        return false
    },
    optionsBuilder,
})
