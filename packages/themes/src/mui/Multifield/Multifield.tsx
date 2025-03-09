import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { RowsList } from '@form-crafter/generator'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box, Button } from '@mui/material'
import { forwardRef, memo } from 'react'

import { initialAddButtonText } from '../../consts'
import { Title } from '../Title'

const optionsBuilder = builders.group({
    title: builders.input().label('Заголовок').nullable(),
    addButtonText: builders.input().label('Текст кнопки добавления').nullable(),
})

type ComponentProps = FormCrafterComponentProps<'repeater', OptionsBuilderOutput<typeof optionsBuilder>>

const Multifield = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ id, rows, onAddRow, properties: { title, addButtonText } }, ref) => {
        const finalAddButtonText = addButtonText || initialAddButtonText

        return (
            <Box ref={ref} gap={4}>
                <Box gap={2} display="flex" justifyContent="space-between">
                    {title && <Title id={id}>{title}</Title>}
                    <Button onClick={onAddRow}>{finalAddButtonText}</Button>
                </Box>
                {isNotEmpty(rows) && <RowsList rows={rows} />}
            </Box>
        )
    }),
)

Multifield.displayName = 'Multifield'

export const multifieldModule = createComponentModule({
    name: 'multifield',
    label: 'Multifield',
    type: 'repeater',
    optionsBuilder,
    Component: Multifield,
})
