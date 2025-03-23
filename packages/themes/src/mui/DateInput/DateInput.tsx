import { createComponentModule, FormCrafterComponentProps, MaskOptions, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { MaskitoDateMode, maskitoDateOptionsGenerator } from '@maskito/kit'
import { forwardRef, memo, useMemo } from 'react'

import { GeneralMaskInput } from '../../components'
import { inputModule } from '../Input'

const { Component: Input } = inputModule

const defaultMode: MaskitoDateMode = 'dd/mm/yyyy'

const optionsBuilder = builders.group({
    value: builders.date().label('Значение').required().nullable(),
    label: builders.input().label('Название'),
    placeholder: builders.input().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    pattern: builders
        .select()
        .options([
            {
                value: defaultMode,
                label: defaultMode,
            },
        ])
        .label('Формат даты')
        .value(defaultMode),
    showMask: builders.checkbox().label('Показывать маску').value(false),
})

type ComponentProps = FormCrafterComponentProps<'editable', OptionsBuilderOutput<typeof optionsBuilder>>

const DateInput = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { pattern, showMask, ...properties }, ...props }, ref) => {
        const maskOptions: MaskOptions = useMemo(
            () =>
                maskitoDateOptionsGenerator({
                    mode: (pattern as MaskitoDateMode) || defaultMode,
                }),
            [pattern],
        )

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

DateInput.displayName = 'DateInput'

export const dateInputModule = createComponentModule({
    name: 'date-input',
    label: 'Date input',
    type: 'editable',
    optionsBuilder,
    operatorsForConditions: [],
    Component: DateInput,
})
