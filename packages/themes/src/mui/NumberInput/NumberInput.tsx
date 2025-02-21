import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { forwardRef, memo } from 'react'

import { GeneralMaskInput } from '../../components'
import { inputModule } from '../Input'

const { Component: Input } = inputModule

const maskOptions = maskitoNumberOptionsGenerator({
    decimalSeparator: ',',
    thousandSeparator: '.',
    precision: 2,
})

const optionsBuilder = builders.group({
    value: builders.input().label('Значение').required().nullable(),
    label: builders.input().label('Название'),
    placeholder: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = FormCrafterComponentProps<'base', OptionsBuilderOutput<typeof optionsBuilder>>

const NumberInput = memo(
    forwardRef<HTMLInputElement, ComponentProps>(({ properties, meta, ...props }, ref) => {
        return (
            <GeneralMaskInput
                ref={ref}
                {...props}
                maskOptions={maskOptions}
                Component={Input}
                properties={properties}
                meta={{ ...meta, name: inputModule.name }}
            />
        )
    }),
)

NumberInput.displayName = 'NumberInput'

export const numberInputModule = createComponentModule({
    name: 'number-input',
    label: 'Number input',
    type: 'base',
    optionsBuilder,
    Component: NumberInput,
})
