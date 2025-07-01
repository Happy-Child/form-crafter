import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput, SelectionOption } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { toggleArrItem } from '@form-crafter/utils'
import { Box, Checkbox as CheckboxBase, FormControl, FormControlLabel, FormLabel } from '@mui/material'
import { forwardRef, memo, useCallback } from 'react'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'

const optionsBuilder = builders.group({
    label: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    readonly: builders.checkbox().label('Только для чтения').required().nullable(),
    value: builders
        .multiSelect()
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
    options: builders
        .multifield({
            label: builders.text().label('Название').required().value('Например'),
            value: builders.text().label('Значение').required().value('value'),
        })
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

type ComponentProps = EditableComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const Checkbox = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ properties: { options, value, label, disabled }, onChangeProperties }, ref) => {
        const isChecked = useCallback((option: Pick<SelectionOption, 'value'>) => (value?.length ? value.includes(option.value) : false), [value])

        const hanleChange = useCallback(
            (valueToChange: SelectionOption['value']) => {
                const finalValues = toggleArrItem(value || [], valueToChange)
                onChangeProperties({ value: finalValues })
            },
            [value, onChangeProperties],
        )

        return (
            <FormControl ref={ref} fullWidth>
                {label && <FormLabel>{label}</FormLabel>}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <CheckboxBase
                                    checked={isChecked(option)}
                                    name={option.value}
                                    value={option.value}
                                    disabled={disabled}
                                    onChange={() => hanleChange(option.value)}
                                />
                            }
                            label={option.label}
                        />
                    ))}
                </Box>
            </FormControl>
        )
    }),
)

Checkbox.displayName = 'Checkbox'

export const checkboxModule = createEditableComponentModule({
    name: 'checkbox',
    label: 'Checkbox',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    relationsRules: [rules.relations.duplicateValueRule],
    validationsRules: [rules.validations.editable.isRequiredRule],
    Component: Checkbox,
})
