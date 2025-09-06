import { createMutationRule } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'

const optionsBuilder = builders.group({
    newOptions: builders
        .multifield(
            builders.group({
                label: builders.text().label('Название').required().value('Название'),
                value: builders.text().label('Значение').required().value('Значение'),
            }),
        )
        .label('Список опций')
        .required(),
})

export const changeSelectOptionsRule = createMutationRule({
    key: 'changeSelectOptions',
    displayName: 'Установка значений выпадающего списка',
    execute: (_, { options }) => {
        console.log('newOptions: ', _, options)

        if (!isNotEmpty(options)) {
            return null
        }

        const { newOptions } = options

        return { value: newOptions[0].value, options: newOptions }
    },
    optionsBuilder,
})
