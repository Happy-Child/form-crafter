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

const Email = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ properties: { label, placeholder, disabled, value }, onChangeProperties }, ref) => {
        return (
            <TextField
                inputRef={ref}
                fullWidth
                value={value}
                disabled={disabled}
                label={label}
                placeholder={placeholder}
                onChange={(e) => onChangeProperties({ value: e.target.value })}
            />
        )
    }),
)

Email.displayName = 'Email'

export const emailModule = createEditableComponentModule({
    name: 'email',
    label: 'Email',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    relationsRules: [rules.relations.duplicateValueRule],
    validationsRules: [rules.validations.editable.isRequiredRule, rules.validations.editable.isEmailRule],
    Component: Email,
})
