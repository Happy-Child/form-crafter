import { createRepeaterComponentModule, OptionsBuilderOutput, RepeaterComponentProps } from '@form-crafter/core'
import { RowsList } from '@form-crafter/generator'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box, Button, FormHelperText } from '@mui/material'
import { forwardRef, memo } from 'react'

import { componentsOperators } from '../../components-operators'
import { initialAddButtonText } from '../../consts'
import { rules } from '../../rules'
import { Title } from '../Title'

const optionsBuilder = builders.group({
    title: builders.text().label('Заголовок').nullable(),
    addButtonText: builders.text().label('Текст кнопки добавления').nullable(),
})

type ComponentProps = RepeaterComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const Multifield = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ id, rows, onAddRow, properties: { title, addButtonText }, error }, ref) => {
        const finalAddButtonText = addButtonText || initialAddButtonText

        return (
            <Box ref={ref} gap={4}>
                <Box gap={2} display="flex" justifyContent="space-between">
                    {title && <Title id={id}>{title}</Title>}
                    <Button onClick={onAddRow}>{finalAddButtonText}</Button>
                </Box>
                {isNotEmpty(rows) && <RowsList rows={rows} />}
                {isNotEmpty(error?.message) && <FormHelperText error>{error.message}</FormHelperText>}
            </Box>
        )
    }),
)

Multifield.displayName = 'Multifield'

export const multifieldModule = createRepeaterComponentModule({
    name: 'multifield',
    label: 'Multifield',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    relationsRules: [],
    validationsRules: [rules.validations.repeater.isRequiredRule, rules.validations.repeater.minLengthRule, rules.validations.repeater.maxLengthRule],
    Component: Multifield,
})
