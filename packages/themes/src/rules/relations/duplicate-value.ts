import { createRelationRule, EditableComponentProperties, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const optionsBuilder = builders.group({
    duplicateValueComponentId: builders.selectComponent().label('Выберете поле').required(),
})

export const duplicateValueRule = createRelationRule<EditableComponentProperties, typeof optionsBuilder>({
    ruleName: 'duplicateValue',
    displayName: 'Дублирование значения',
    optionsBuilder,
    execute: (_, { options, ctx }) => {
        const { duplicateValueComponentId } = options
        const componentSchema = ctx.getComponentSchemaById(duplicateValueComponentId)

        if (isEditableComponentSchema(componentSchema)) {
            return { properties: { value: componentSchema.properties.value, readonly: true } }
        }

        return null
    },
})
