import { createComponentConditionOperator, isEditableComponentSchema } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isString } from '@form-crafter/utils'
import dayjs from 'dayjs'

const optionsBuilder = builders.group({
    date: builders.datePicker().label('Дата').required(),
})

export const afterDateOperator = createComponentConditionOperator<typeof optionsBuilder>({
    name: 'afterDate',
    displayName: 'Значение даты должно быть после',
    execute: (componentId, { ctx, options }) => {
        const componentSchema = ctx.getComponentSchemaById(componentId)

        if (isEditableComponentSchema(componentSchema) && isString(componentSchema.properties.value)) {
            return dayjs(componentSchema.properties.value).isAfter(options.date)
        }

        return false
    },
    optionsBuilder,
})
