import { builders } from '@form-crafter/options-builder'

export const optionsBuilder = builders.group({
    value: builders.text().label('Значение').required(),
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})
