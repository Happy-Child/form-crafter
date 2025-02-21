import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { Box, FormControl, FormControlLabel, FormLabel, Radio as RadioBase } from '@mui/material'
import { forwardRef, memo } from 'react'

const optionsBuilder = builders.group({
    label: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    value: builders
        .select()
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

const Radio = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { options, value, label, disabled }, onChangeProperties }, ref) => {
        return (
            <FormControl ref={ref} fullWidth>
                {label && <FormLabel>{label}</FormLabel>}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <RadioBase
                                    checked={value === option.value}
                                    name={meta.formKey}
                                    value={option.value}
                                    disabled={disabled}
                                    onChange={() => onChangeProperties({ value: option.value })}
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

Radio.displayName = 'Radio'

export const radioModule = createComponentModule({
    name: 'radio',
    label: 'Radio',
    type: 'base',
    optionsBuilder,
    Component: Radio,
})
