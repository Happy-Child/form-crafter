import { ChangeEvent, forwardRef, memo } from 'react'

import { createTextInputComponentModule } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { FormControl, FormHelperText, TextField } from '@mui/material'

import { componentsOperators } from '../../components-operators'
import { rules as generalRules } from '../../rules'
import { componentName } from './consts'
import { optionsBuilder } from './options-builder'
import { rules } from './rules'
import { TextInputComponentProps } from './types'

const TextInput = memo(
    forwardRef<HTMLInputElement, TextInputComponentProps>(
        ({ meta, onChangeProperties, onBlur, isRequired, firstError, properties: { value, placeholder, label, disabled, readonly } }, ref) => {
            const finalValue = value || ''

            return (
                <FormControl fullWidth error={isNotEmpty(firstError?.message)}>
                    <TextField
                        label={label}
                        inputRef={ref}
                        value={finalValue}
                        name={meta.formKey}
                        disabled={disabled}
                        placeholder={placeholder}
                        onInput={(e: ChangeEvent<HTMLInputElement>) => onChangeProperties({ value: e.target.value })}
                        onBlur={onBlur}
                        error={isNotEmpty(firstError?.message)}
                        required={isRequired}
                        fullWidth
                        slotProps={{
                            input: {
                                readOnly: !!readonly,
                            },
                        }}
                    />
                    {isNotEmpty(firstError?.message) && <FormHelperText>{firstError.message}</FormHelperText>}
                </FormControl>
            )
        },
    ),
)

TextInput.displayName = 'TextInput'

export const textInputModule = createTextInputComponentModule({
    name: componentName,
    label: 'Text Field',
    optionsBuilder,
    operators: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.endsWithOperator,
        componentsOperators.startsWithOperator,
    ],
    mutations: [generalRules.mutations.duplicateValueRule, generalRules.mutations.disabledRule],
    validations: [
        rules.validations.isEmailRule,
        generalRules.validations.components.editable.isRequiredRule,
        generalRules.validations.components.editable.minLengthRule,
        generalRules.validations.components.editable.maxLengthRule,
    ],
    Component: TextInput,
})
