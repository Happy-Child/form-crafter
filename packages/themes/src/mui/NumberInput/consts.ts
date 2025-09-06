import { maskitoNumberOptionsGenerator } from '@maskito/kit'

export const maskOptions = maskitoNumberOptionsGenerator({
    decimalSeparator: ',',
    thousandSeparator: '.',
    precision: 2,
})

export const componentName = 'number-input'
