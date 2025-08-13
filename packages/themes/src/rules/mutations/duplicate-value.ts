import { createMutationRule, EditableComponentProperties, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isEmpty } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    duplicateValueComponentId: builders.selectComponent().label('Выберете поле').required(),
})

export const duplicateValueRule = createMutationRule<EditableComponentProperties, typeof optionsBuilder>({
    ruleName: 'duplicateValue',
    displayName: 'Дублирование значения',
    optionsBuilder,
    execute: (_, { options, ctx }) => {
        if (isEmpty(options)) {
            return null
        }

        const { duplicateValueComponentId } = options
        const componentSchema = ctx.getComponentSchemaById(duplicateValueComponentId)

        if (isEditableComponentSchema(componentSchema)) {
            return { value: componentSchema.properties.value, readonly: true }
        }

        return null
    },
})
