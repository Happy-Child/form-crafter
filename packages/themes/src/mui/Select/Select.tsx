import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select as SelectBase } from '@mui/material'
import { SelectInputProps } from '@mui/material/Select/SelectInput'
import { forwardRef, memo, useCallback } from 'react'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'

const optionsBuilder = builders.group({
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
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    options: builders
        .multifield({
            label: builders.text().label('Название').required().value('Название'),
            value: builders.text().label('Значение').required().value('Значение'),
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

const Select = memo(
    forwardRef<HTMLDivElement, ComponentProps>(
        ({ meta, properties: { options, value, label, disabled }, onChangeProperties, isRequired, error, onBlur }, ref) => {
            const handleChange = useCallback<Required<SelectInputProps<string[]>>['onChange']>(
                ({ target: { value } }) => {
                    const finalValues = Array.isArray(value) ? value : [value]
                    onChangeProperties({ value: finalValues })
                },
                [onChangeProperties],
            )

            return (
                <FormControl ref={ref} fullWidth>
                    {label && <InputLabel>{label}</InputLabel>}
                    <SelectBase
                        multiple
                        name={meta.formKey}
                        value={value || []}
                        renderValue={(selected) => selected.join(', ')}
                        disabled={disabled}
                        label={label}
                        onChange={handleChange}
                        onBlur={onBlur}
                        error={isNotEmpty(error?.message)}
                        required={isRequired}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <ListItemText primary={option.label} />
                            </MenuItem>
                        ))}
                    </SelectBase>
                    {isNotEmpty(error?.message) && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
            )
        },
    ),
)

Select.displayName = 'Select'

export const selectModule = createEditableComponentModule({
    name: 'select',
    label: 'Select',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator, componentsOperators.equalStringOperator],
    relationsRules: [rules.relations.duplicateValueRule, rules.relations.changeSelectOptionsRule],
    validationsRules: [rules.validations.editable.isRequiredRule],
    Component: Select,
})
