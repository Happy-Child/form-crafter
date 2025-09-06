import { createComponentConditionOperator } from '@form-crafter/core'
import { isArray } from '@form-crafter/utils'
import { isEqual } from 'lodash-es'

export const equalOperator = createComponentConditionOperator({
    key: 'equal',
    displayName: 'Значение должно совпадать',
    execute: ({ properties }, { enteredComponentValue }) => {
        const value = properties.value

        if (isArray(value)) {
            return isEqual(new Set(value), new Set(enteredComponentValue as []))
        }

        return isEqual(value, enteredComponentValue)
    },
    enterComponentValue: { available: true },
})
