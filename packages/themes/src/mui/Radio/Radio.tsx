import { forwardRef, memo } from 'react'

import { createSelectComponentModule, SelectComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio as RadioBase } from '@mui/material'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'

const optionsBuilder = builders.group({
    label: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    readonly: builders.checkbox().label('Только для чтения'),
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

type ComponentProps = SelectComponentProps<typeof optionsBuilder>

const Radio = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { options, value, label, disabled }, isRequired, firstError, onChangeProperties }, ref) => {
        return (
            <FormControl ref={ref} required={isRequired} fullWidth error={isNotEmpty(firstError)}>
                {label && <FormLabel>{label}</FormLabel>}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            label={option.label}
                            control={
                                <RadioBase
                                    checked={value === option.value}
                                    name={meta.formKey}
                                    value={option.value}
                                    disabled={disabled}
                                    onChange={() => onChangeProperties({ value: option.value })}
                                />
                            }
                        />
                    ))}
                </Box>
                {isNotEmpty(firstError?.message) && <FormHelperText error>{firstError.message}</FormHelperText>}
            </FormControl>
        )
    }),
)

Radio.displayName = 'Radio'

export const radioModule = createSelectComponentModule({
    name: 'radio',
    label: 'Radio',
    optionsBuilder,
    operators: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    mutations: [rules.mutations.duplicateValueRule],
    validations: [rules.validations.components.editable.isRequiredRule],
    Component: Radio,
})
