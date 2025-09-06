import { forwardRef, memo } from 'react'

import { createTextInputComponentModule, TextInputComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { maskitoTimeOptionsGenerator } from '@maskito/kit'

import { GeneralMaskInput } from '../../components'
import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'
import { textInputModule } from '../TextInput'

const { Component: TextInput } = textInputModule

const maskOptions = maskitoTimeOptionsGenerator({
    mode: 'HH:MM',
})

const optionsBuilder = builders.group({
    value: builders.timePicker().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
    showMask: builders.checkbox().label('Показывать маску').value(false),
})

type ComponentProps = TextInputComponentProps<typeof optionsBuilder>

const TimeInput = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ properties: { showMask, ...properties }, ...props }, ref) => {
        return <GeneralMaskInput ref={ref} {...props} maskOptions={maskOptions} Component={TextInput} properties={properties} showMask={showMask} />
    }),
)

TimeInput.displayName = 'TimeInput'

export const timeInputModule = createTextInputComponentModule({
    name: 'time-input',
    label: 'Time field',
    optionsBuilder,
    operators: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    mutations: [rules.mutations.duplicateValueRule],
    validations: [rules.validations.components.editable.isRequiredRule],
    Component: TimeInput,
})
