import { createRelationRule } from '@form-crafter/core'

export const disabledRule = createRelationRule({
    ruleName: 'disabled',
    displayName: 'Блокировка поля',
    execute: () => {
        return { disabled: true }
    },
})
