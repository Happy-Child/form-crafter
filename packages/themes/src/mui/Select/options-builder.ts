import { builders } from '@form-crafter/options-builder'

export const optionsBuilder = builders.group({
    value: builders
        .select()
        .options([
            {
                label: 'Мужской',
                value: 'male',
            },
            {
                label: 'Женский',
                value: 'female',
            },
        ])
        .required()
        .nullable(),
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    options: builders
        .multifield(
            builders.group({
                label: builders.text().label('Название').required().value('Название'),
                value: builders.text().label('Значение').required().value('Значение'),
            }),
        )
        .required()
        .label('Список опций')
        .value([
            {
                label: 'Мужской',
                value: 'male',
            },
            {
                label: 'Женский',
                value: 'female',
            },
        ]),
})
