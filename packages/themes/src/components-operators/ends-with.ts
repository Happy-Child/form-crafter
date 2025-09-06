import { createComponentConditionOperator } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    endsWith: builders.text().label('Значение').required(),
})

export const endsWithOperator = createComponentConditionOperator({
    key: 'endsWith',
    displayName: 'Оканчивается на',
    execute: ({ properties }, { options }) => {
        const value = properties.value

        if (isString(value)) {
            return value.endsWith(options.endsWith)
        }

        return false
    },
    optionsBuilder,
})
