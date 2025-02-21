import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { TextField } from '@mui/material'
import { ChangeEvent, forwardRef, memo } from 'react'

const optionsBuilder = builders.group({
    value: builders.input().label('Значение').required().nullable(),
    label: builders.input().label('Название'),
    placeholder: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = FormCrafterComponentProps<'base', OptionsBuilderOutput<typeof optionsBuilder>>

const Input = memo(
    forwardRef<HTMLInputElement, ComponentProps>(({ meta, properties: { value, placeholder, label, disabled }, onChangeProperties }, ref) => {
        const finalValue = value || ''
        return (
            <TextField
                inputRef={ref}
                value={finalValue}
                name={meta.formKey}
                disabled={disabled}
                label={label}
                placeholder={placeholder}
                onInput={(e: ChangeEvent<HTMLInputElement>) => onChangeProperties({ value: e.target.value })}
                fullWidth
            />
        )
    }),
)

Input.displayName = 'Input'

export const inputModule = createComponentModule({
    name: 'input',
    label: 'Input',
    type: 'base',
    optionsBuilder,
    Component: Input,
})
