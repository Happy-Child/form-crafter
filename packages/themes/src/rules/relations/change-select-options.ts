import { createRelationRule, EditableComponentProperties } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'

const optionsBuilder = builders.group({
    topComponentId: builders.selectComponent().label('Выберете поле').nullable(),
    example: builders.group({
        componentId: builders.selectComponent().label('Выберете поле').nullable(),
    }),
    newOptions: builders
        .multifield({
            label: builders.text().label('Название').required().value('Название'),
            value: builders.text().label('Значение').required().value('Значение'),
        })
        .label('Список опций')
        .required(),
})

export const changeSelectOptionsRule = createRelationRule<EditableComponentProperties, typeof optionsBuilder>({
    ruleName: 'changeSelectOptions',
    displayName: 'Установка значений выпадающего списка',
    optionsBuilder,
    execute: (_, { options }) => {
        const { newOptions } = options

        return { properties: { value: [], options: newOptions } }
    },
})
