import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput, SelectionOption } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { toggleArrItem } from '@form-crafter/utils'
import { Box, Checkbox as CheckboxBase, FormControl, FormControlLabel, FormLabel } from '@mui/material'
import { forwardRef, memo, useCallback } from 'react'

const optionsBuilder = builders.group({
    label: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
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
            label: builders.input().label('Название').required().value('Например'),
            value: builders.input().label('Значение').required().value('value'),
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

type ComponentProps = FormCrafterComponentProps<'base', OptionsBuilderOutput<typeof optionsBuilder>>

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

export const checkboxModule = createComponentModule({
    name: 'checkbox',
    label: 'Checkbox',
    type: 'base',
    optionsBuilder,
    Component: Checkbox,
})
