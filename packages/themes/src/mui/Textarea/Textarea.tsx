import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { TextField } from '@mui/material'
import { forwardRef, memo } from 'react'

const optionsBuilder = builders.group({
    value: builders.input().label('Значение').required().nullable(),
    label: builders.input().label('Название'),
    placeholder: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = FormCrafterComponentProps<'base', OptionsBuilderOutput<typeof optionsBuilder>>

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

export const textareaModule = createComponentModule({
    name: 'textarea',
    label: 'Textarea',
    type: 'base',
    optionsBuilder,
    Component: Textarea,
})
