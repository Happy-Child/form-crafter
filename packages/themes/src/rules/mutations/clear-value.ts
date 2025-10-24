import { createMutationRule } from '@form-crafter/core'

export const clearValueRule = createMutationRule({
    key: 'clearValue',
    displayName: 'Очистить поле',
    execute: () => ({ value: '' }),
})
