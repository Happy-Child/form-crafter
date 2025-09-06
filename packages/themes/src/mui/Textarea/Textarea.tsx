import { forwardRef, memo } from 'react'

import { createTextInputComponentModule, TextInputComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { TextField } from '@mui/material'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'

const optionsBuilder = builders.group({
    value: builders.text().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = TextInputComponentProps<typeof optionsBuilder>

const Textarea = memo(
    forwardRef<HTMLDivElement, ComponentProps>(
        ({ meta, properties: { value, placeholder, label, disabled }, onChangeProperties, isRequired, firstError, onBlur }, ref) => {
            return (
                <TextField
                    ref={ref}
                    value={value}
                    multiline
                    name={meta.formKey}
                    disabled={disabled}
                    label={label}
                    placeholder={placeholder}
                    fullWidth
                    minRows={4}
                    onChange={(e) => onChangeProperties({ value: e.target.value })}
                    onBlur={onBlur}
                    error={isNotEmpty(firstError?.message)}
                    helperText={firstError?.message}
                    required={isRequired}
                />
            )
        },
    ),
)

Textarea.displayName = 'Textarea'

export const textareaModule = createTextInputComponentModule({
    name: 'textarea',
    label: 'Textarea',
    optionsBuilder,
    operators: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.endsWithOperator,
        componentsOperators.startsWithOperator,
    ],
    mutations: [rules.mutations.duplicateValueRule],
    validations: [
        rules.validations.components.editable.isRequiredRule,
        rules.validations.components.editable.minLengthRule,
        rules.validations.components.editable.maxLengthRule,
    ],
    Component: Textarea,
})
