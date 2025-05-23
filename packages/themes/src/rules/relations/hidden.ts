import { createRelationRule } from '@form-crafter/core'

export const hiddenRule = createRelationRule({
    ruleName: 'hidden',
    displayName: 'Скрытие поля',
    execute: () => {
        return { settings: { hidden: true } }
    },
})
