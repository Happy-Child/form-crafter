import { builders } from '@form-crafter/options-builder'

export const optionsBuilder = builders.group({
    title: builders.text().label('Заголовок').nullable(),
})
