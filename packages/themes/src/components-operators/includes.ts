import { createComponentConditionOperator } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isArray } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    valueForIncludes: builders.text().label('Значение').required(),
})

export const includesOperator = createComponentConditionOperator({
    key: 'includes',
    displayName: 'Включает значение',
    execute: ({ properties }, { options }) => {
        const value = properties.value

        if (isArray(value)) {
            return value.includes(options.valueForIncludes)
        }

        return false
    },
    optionsBuilder,
})
