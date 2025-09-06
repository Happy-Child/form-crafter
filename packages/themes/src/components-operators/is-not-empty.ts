import { createComponentConditionOperator } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

export const isNotEmptyOperator = createComponentConditionOperator({
    key: 'isNotEmpty',
    displayName: 'Не пусто',
    execute: ({ properties }) => isNotEmpty(properties.value),
})
