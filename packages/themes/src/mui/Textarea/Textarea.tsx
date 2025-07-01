import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { TextField } from '@mui/material'
import { forwardRef, memo } from 'react'

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

const Textarea = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { value, placeholder, label, disabled }, onChangeProperties }, ref) => {
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
            />
        )
    }),
)

Textarea.displayName = 'Textarea'

export const textareaModule = createEditableComponentModule({
    name: 'textarea',
    label: 'Textarea',
    optionsBuilder,
    operatorsForConditions: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.endsWithOperator,
        componentsOperators.startsWithOperator,
    ],
    relationsRules: [rules.relations.duplicateValueRule],
    validationsRules: [rules.validations.editable.isRequiredRule, rules.validations.editable.minLengthRule, rules.validations.editable.maxLengthRule],
    Component: Textarea,
})
