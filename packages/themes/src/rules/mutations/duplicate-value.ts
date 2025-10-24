import { createMutationRule, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const optionsBuilder = builders.group({
    duplicateValueComponentId: builders.selectComponent().label('Выберете поле').required(),
})

export const duplicateValueRule = createMutationRule({
    key: 'duplicateValue',
    displayName: 'Дублирование значения',
    execute: (_, { options, ctx }) => {
        const { duplicateValueComponentId } = options
        const componentSchema = ctx.getComponentSchemaById(duplicateValueComponentId)

        if (isEditableComponentSchema(componentSchema)) {
            return { value: componentSchema.properties.value, readonly: true }
        }

        return null
    },
    optionsBuilder,
    rollback: {
        default: 'skip',
    },
})
