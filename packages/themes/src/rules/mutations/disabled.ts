import { createMutationRule } from '@form-crafter/core'

export const disabledRule = createMutationRule({
    key: 'disabled',
    displayName: 'Блокировка поля',
    execute: () => ({ disabled: true }),
})
