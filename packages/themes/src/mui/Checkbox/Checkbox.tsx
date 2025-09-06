import { forwardRef, memo, useCallback } from 'react'

import { createMultipleSelectComponentModule, MultipleSelectComponentProps, SelectionOption } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty, toggleArrItem } from '@form-crafter/utils'
import { Box, Checkbox as CheckboxBase, FormControl, FormControlLabel, FormHelperText, FormLabel } from '@mui/material'

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
        .multifield(
            builders.group({
                label: builders.text().label('Название').required().value('Например'),
                value: builders.text().label('Значение').required().value('value'),
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

type ComponentProps = MultipleSelectComponentProps<typeof optionsBuilder>

const Checkbox = memo(
    forwardRef<HTMLDivElement, ComponentProps>(
        ({ properties: { options, value, label, disabled, readonly }, onChangeProperties, isRequired, firstError }, ref) => {
            const isChecked = useCallback((option: Pick<SelectionOption, 'value'>) => (value?.length ? value.includes(option.value) : false), [value])

            const hanleChange = useCallback(
                (valueToChange: SelectionOption['value']) => {
                    const finalValues = toggleArrItem(value || [], valueToChange)
                    onChangeProperties({ value: finalValues })
                },
                [value, onChangeProperties],
            )

            return (
                <FormControl ref={ref} required={isRequired} fullWidth error={isNotEmpty(firstError?.message)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Box flexDirection="column" sx={{ display: 'flex', gap: 1 }}>
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
                                        readOnly={!!readonly}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </Box>
                    {isNotEmpty(firstError?.message) && <FormHelperText>{firstError.message}</FormHelperText>}
                </FormControl>
            )
        },
    ),
)

Checkbox.displayName = 'Checkbox'

export const checkboxModule = createMultipleSelectComponentModule({
    name: 'checkbox',
    label: 'Checkbox',
    optionsBuilder,
    operators: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    mutations: [rules.mutations.duplicateValueRule],
    validations: [rules.validations.components.editable.isRequiredRule],
    Component: Checkbox,
})
