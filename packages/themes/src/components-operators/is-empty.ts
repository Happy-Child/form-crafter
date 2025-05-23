import { createComponentConditionOperator, isEditableComponentSchema, isRepeaterComponentSchema } from '@form-crafter/core'
import { isEmpty } from '@form-crafter/utils'

export const isEmptyOperator = createComponentConditionOperator({
    name: 'isEmpty',
    displayName: 'Пусто',
    execute: (componentId, { ctx }) => {
        const componentSchema = ctx.getComponentSchemaById(componentId)

        if (isEditableComponentSchema(componentSchema)) {
            return isEmpty(componentSchema.properties.value)
        }

        if (isRepeaterComponentSchema(componentSchema)) {
            const children = ctx.getRepeaterChildIds(componentId)
            return isEmpty(children)
        }

        // TODO check template component id

        return false
    },
})
