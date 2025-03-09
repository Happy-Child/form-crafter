import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { maskitoTimeOptionsGenerator } from '@maskito/kit'
import { forwardRef, memo } from 'react'

import { GeneralMaskInput } from '../../components'
import { inputModule } from '../Input'

const { Component: Input } = inputModule

const maskOptions = maskitoTimeOptionsGenerator({
    mode: 'HH:MM',
})

const optionsBuilder = builders.group({
    value: builders.input().label('Значение').required().nullable(),
    label: builders.input().label('Название'),
    placeholder: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    showMask: builders.checkbox().label('Показывать маску').value(false),
})

type ComponentProps = FormCrafterComponentProps<'editable', OptionsBuilderOutput<typeof optionsBuilder>>

const TimeInput = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { showMask, ...properties }, ...props }, ref) => {
        return (
            <GeneralMaskInput
                ref={ref}
                {...props}
                maskOptions={maskOptions}
                Component={Input}
                properties={properties}
                showMask={showMask}
                meta={{ ...meta, name: inputModule.name }}
            />
        )
    }),
)

TimeInput.displayName = 'TimeInput'

export const timeInputModule = createComponentModule({
    name: 'time-input',
    label: 'Time input',
    type: 'editable',
    optionsBuilder,
    Component: TimeInput,
})
