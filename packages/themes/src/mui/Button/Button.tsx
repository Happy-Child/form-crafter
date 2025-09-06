import { forwardRef, memo } from 'react'

import { createStaticComponentModule, StaticComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { Button as ButtonBase } from '@mui/material'

const defautType = 'button'

const optionsBuilder = builders.group({
    text: builders.text().label('Текст кнопки').required(),
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

type ComponentProps = StaticComponentProps<typeof optionsBuilder>

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

export const buttonModule = createStaticComponentModule({
    name: 'button',
    label: 'Button',
    optionsBuilder,
    Component: Button,
})
