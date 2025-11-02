import { forwardRef, memo } from 'react'

import { createRepeaterComponentModule, RepeaterComponentProps } from '@form-crafter/core'
import { RowsList } from '@form-crafter/generator'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box, Button, FormHelperText } from '@mui/material'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'
import { Title } from '../Group/components/Title'
import { initialAddButtonText } from './consts'

const optionsBuilder = builders.group({
    title: builders.text().label('Заголовок').nullable(),
    addButtonText: builders.text().label('Текст кнопки добавления').nullable(),
})

type ComponentProps = RepeaterComponentProps<typeof optionsBuilder>

const Multifield = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ id, childrenRows, onAddRow, properties: { title, addButtonText }, firstError }, ref) => {
        const finalAddButtonText = addButtonText || initialAddButtonText

        return (
            <Box ref={ref} gap={4}>
                <Box gap={2} display="flex" justifyContent="space-between">
                    {title && <Title id={id}>{title}</Title>}
                    <Button onClick={onAddRow}>{finalAddButtonText}</Button>
                </Box>
                {isNotEmpty(childrenRows) && <RowsList rows={childrenRows} />}
                {isNotEmpty(firstError?.message) && <FormHelperText error>{firstError.message}</FormHelperText>}
            </Box>
        )
    }),
)

Multifield.displayName = 'Multifield'

export const multifieldModule = createRepeaterComponentModule({
    name: 'multifield',
    label: 'Multifield',
    optionsBuilder,
    operators: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    validations: [
        rules.validations.components.repeater.isRequiredRule,
        rules.validations.components.repeater.minLengthRule,
        rules.validations.components.repeater.maxLengthRule,
    ],
    Component: Multifield,
})
