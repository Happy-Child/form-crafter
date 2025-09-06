import { createComponentConditionOperator } from '@form-crafter/core'
import { isEmpty } from '@form-crafter/utils'

export const isEmptyOperator = createComponentConditionOperator({
    key: 'isEmpty',
    displayName: 'Пусто',
    execute: ({ properties }) => isEmpty(properties.value),
})
