import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { Box, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio as Radioeditable } from '@mui/material'
import { forwardRef, memo } from 'react'

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

const Radio = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { options, value, label, disabled }, isRequired, firstError, onChangeProperties }, ref) => {
        return (
            <FormControl ref={ref} required={isRequired} fullWidth error={isNotEmpty(firstError)}>
                {label && <FormLabel>{label}</FormLabel>}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            required={isRequired}
                            control={
                                <Radioeditable
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
                {isNotEmpty(firstError?.message) && <FormHelperText error>{firstError.message}</FormHelperText>}
            </FormControl>
        )
    }),
)

Radio.displayName = 'Radio'

export const radioModule = createEditableComponentModule({
    name: 'radio',
    label: 'Radio',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    mutationsRules: [rules.mutations.duplicateValueRule],
    validationsRules: [rules.validations.editable.isRequiredRule],
    Component: Radio,
})
