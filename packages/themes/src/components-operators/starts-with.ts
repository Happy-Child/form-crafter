import { createComponentConditionOperator, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    startsWith: builders.text().label('Значение').required(),
})

export const startsWithOperator = createComponentConditionOperator<typeof optionsBuilder>({
    name: 'startsWith',
    displayName: 'Начинается c',
    execute: (componentId, { ctx, options }) => {
        const componentSchema = ctx.getComponentSchemaById(componentId)

        if (isEditableComponentSchema(componentSchema) && isString(componentSchema.properties.value)) {
            return componentSchema.properties.value.startsWith(options.startsWith)
        }

        return false
    },
    optionsBuilder,
})
