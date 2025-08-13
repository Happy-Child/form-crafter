import { createMutationRule } from '@form-crafter/core'

export const disabledRule = createMutationRule({
    ruleName: 'disabled',
    displayName: 'Блокировка поля',
    execute: () => {
        return { disabled: true }
    },
})
