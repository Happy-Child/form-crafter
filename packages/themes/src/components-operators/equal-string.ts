import { createComponentConditionOperator, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isArray, isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    equalTo: builders.text().label('Должно равняться').required(),
})

export const equalStringOperator = createComponentConditionOperator<typeof optionsBuilder>({
    name: 'equalString',
    displayName: 'Равно',
    execute: (componentId, { ctx, options }) => {
        const componentSchema = ctx.getComponentSchemaById(componentId)

        if (isEditableComponentSchema(componentSchema)) {
            if (isString(componentSchema.properties.value)) {
                return componentSchema.properties.value === options.equalTo
            } else if (isArray(componentSchema.properties.value)) {
                return componentSchema.properties.value.includes(options.equalTo)
            }
        }

        return false
    },
    optionsBuilder,
})
