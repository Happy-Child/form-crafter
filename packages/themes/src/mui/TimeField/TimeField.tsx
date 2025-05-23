import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { maskitoTimeOptionsGenerator } from '@maskito/kit'
import { forwardRef, memo } from 'react'

import { GeneralMaskInput } from '../../components'
import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'
import { textFieldModule } from '../TextField'

const { Component: TextField } = textFieldModule

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

type ComponentProps = EditableComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const TimeField = memo(
    forwardRef<HTMLDivElement, ComponentProps>(({ meta, properties: { showMask, ...properties }, ...props }, ref) => {
        return (
            <GeneralMaskInput
                ref={ref}
                {...props}
                maskOptions={maskOptions}
                Component={TextField}
                properties={properties}
                showMask={showMask}
                meta={{ ...meta, name: textFieldModule.name }}
            />
        )
    }),
)

TimeField.displayName = 'TimeField'

export const timeFieldModule = createEditableComponentModule({
    name: 'time-field',
    label: 'Time field',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    relationsRules: [rules.relations.duplicateValueRule, rules.relations.hiddenRule],
    validationsRules: [rules.validations.editable.isRequiredRule],
    Component: TimeField,
})
