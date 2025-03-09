import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { Button as ButtonBase } from '@mui/material'
import { forwardRef, memo } from 'react'

const defautType = 'button'

const optionsBuilder = builders.group({
    text: builders.input().label('Текст кнопки').required(),
    type: builders
        .select()
        .label('Тип кнопки')
        .value(defautType)
        .options([
            { label: 'Submit', value: 'submit' },
            { label: 'Button', value: defautType },
        ])
        .required(),
})

type ComponentProps = FormCrafterComponentProps<'static', OptionsBuilderOutput<typeof optionsBuilder>>

const Button = memo(
    forwardRef<HTMLButtonElement, ComponentProps>(({ properties: { text, type } }, ref) => {
        return (
            <ButtonBase ref={ref} type={type as Parameters<typeof ButtonBase>[0]['type']}>
                {text}
            </ButtonBase>
        )
    }),
)

Button.displayName = 'Button'

export const buttonModule = createComponentModule({
    name: 'button',
    label: 'Button',
    type: 'static',
    optionsBuilder,
    Component: Button,
})
