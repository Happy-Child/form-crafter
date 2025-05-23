import { createComponentConditionOperator, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isString } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    endsWith: builders.text().label('Значение').required(),
})

export const endsWithOperator = createComponentConditionOperator<typeof optionsBuilder>({
    name: 'endsWith',
    displayName: 'Оканчивается на',
    execute: (componentId, { ctx, options }) => {
        const componentSchema = ctx.getComponentSchemaById(componentId)

        if (isEditableComponentSchema(componentSchema) && isString(componentSchema.properties.value)) {
            return componentSchema.properties.value.endsWith(options.endsWith)
        }

        return false
    },
    optionsBuilder,
})
