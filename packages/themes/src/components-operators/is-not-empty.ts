import { createComponentConditionOperator, isEditableComponentSchema, isRepeaterComponentSchema } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'

export const isNotEmptyOperator = createComponentConditionOperator({
    name: 'isNotEmpty',
    displayName: 'Не пусто',
    execute: (componentId, { ctx }) => {
        const componentSchema = ctx.getComponentSchemaById(componentId)

        if (isEditableComponentSchema(componentSchema)) {
            return isNotEmpty(componentSchema.properties.value)
        }

        if (isRepeaterComponentSchema(componentSchema)) {
            const children = ctx.getRepeaterChildIds(componentId)
            return isNotEmpty(children)
        }

        // TODO check template component id

        return false
    },
})
