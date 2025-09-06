import { builders } from '@form-crafter/options-builder'

import { defaultMode } from './consts'

export const optionsBuilder = builders.group({
    value: builders.date().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения').required().nullable(),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    pattern: builders
        .select()
        .options([
            {
                value: defaultMode,
                label: defaultMode,
            },
        ])
        .label('Формат даты')
        .value(defaultMode),
    showMask: builders.checkbox().label('Показывать маску').value(false),
})
