import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { TextField as TextFieldBase } from '@mui/material'
import { ChangeEvent, forwardRef, memo } from 'react'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'

const optionsBuilder = builders.group({
    value: builders.text().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = EditableComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const TextField = memo(
    forwardRef<HTMLInputElement, ComponentProps>(
        ({ meta, onChangeProperties, onBlur, isRequired, isValidationPending, error, properties: { value, placeholder, label, disabled } }, ref) => {
            const finalValue = value || ''

            return (
                <TextFieldBase
                    inputRef={ref}
                    value={finalValue}
                    name={meta.formKey}
                    disabled={disabled}
                    label={label}
                    placeholder={placeholder}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => onChangeProperties({ value: e.target.value })}
                    onBlur={onBlur}
                    error={isNotEmpty(error?.message)}
                    helperText={error?.message}
                    required={isRequired}
                    fullWidth
                />
            )
        },
    ),
)

TextField.displayName = 'TextField'

export const textFieldModule = createEditableComponentModule({
    name: 'text-field',
    label: 'TextField',
    optionsBuilder,
    operatorsForConditions: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.endsWithOperator,
        componentsOperators.startsWithOperator,
    ],
    relationsRules: [rules.relations.duplicateValueRule],
    validationsRules: [rules.validations.editable.isRequiredRule, rules.validations.editable.minLengthRule, rules.validations.editable.maxLengthRule],
    Component: TextField,
})
