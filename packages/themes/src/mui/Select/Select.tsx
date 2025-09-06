import { forwardRef, memo, useCallback } from 'react'

import { createSelectComponentModule } from '@form-crafter/core'
import { isArray, isNotEmpty } from '@form-crafter/utils'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select as SelectBase } from '@mui/material'
import { SelectInputProps } from '@mui/material/Select/SelectInput'

import { componentsOperators } from '../../components-operators'
import { rules as generalRules } from '../../rules'
import { optionsBuilder } from './options-builder'
import { rules } from './rules'
import { SelectComponentProps } from './types'

const Select = memo(
    forwardRef<HTMLDivElement, SelectComponentProps>(
        ({ meta, properties: { options, value, label, disabled }, onChangeProperties, isRequired, firstError, onBlur }, ref) => {
            const finalValue = isNotEmpty(value) ? [value] : ''

            const handleChange = useCallback<Required<SelectInputProps<string[]>>['onChange']>(
                ({ target: { value: newValue } }) => {
                    onChangeProperties({ value: isArray(newValue) ? newValue[0] : newValue })
                },
                [onChangeProperties],
            )

            return (
                <FormControl ref={ref} fullWidth error={isNotEmpty(firstError?.message)}>
                    {label && <InputLabel>{label}</InputLabel>}
                    <SelectBase
                        name={meta.formKey}
                        value={finalValue}
                        disabled={disabled}
                        label={label}
                        onChange={handleChange}
                        onBlur={onBlur}
                        error={isNotEmpty(firstError?.message)}
                        required={isRequired}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </SelectBase>
                    {isNotEmpty(firstError?.message) && <FormHelperText>{firstError.message}</FormHelperText>}
                </FormControl>
            )
        },
    ),
)

Select.displayName = 'Select'

export const selectModule = createSelectComponentModule({
    name: 'select',
    label: 'Select',
    optionsBuilder,
    operators: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.includesOperator,
        componentsOperators.equalOperator,
    ],
    mutations: [generalRules.mutations.duplicateValueRule, rules.mutations.changeSelectOptionsRule],
    validations: [generalRules.validations.components.editable.isRequiredRule],
    Component: Select,
})
