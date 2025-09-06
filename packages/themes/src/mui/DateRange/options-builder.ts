import { builders } from '@form-crafter/options-builder'

const defaultFormat = 'DD.MM.YYYY'

export const optionsBuilder = builders.group({
    value: builders.dateRange().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения').required().nullable(),
    label: builders.text().label('Название'),
    format: builders
        .select()
        .options([
            {
                value: defaultFormat,
                label: defaultFormat,
            },
        ])
        .label('Формат даты')
        .value(defaultFormat),
    disabled: builders.checkbox().label('Блокировка ввода'),
})
