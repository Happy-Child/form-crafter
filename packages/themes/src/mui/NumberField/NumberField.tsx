import { createEditableComponentModule, EditableComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { forwardRef, memo } from 'react'

import { GeneralMaskInput } from '../../components'
import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'
import { textFieldModule } from '../TextField'

const { Component: TextField } = textFieldModule

const maskOptions = maskitoNumberOptionsGenerator({
    decimalSeparator: ',',
    thousandSeparator: '.',
    precision: 2,
})

const optionsBuilder = builders.group({
    value: builders.number().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения'),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = EditableComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const NumberField = memo(
    forwardRef<HTMLInputElement, ComponentProps>(({ properties, meta, ...props }, ref) => {
        return (
            <GeneralMaskInput
                ref={ref}
                {...props}
                maskOptions={maskOptions}
                Component={TextField}
                properties={properties}
                meta={{ ...meta, name: textFieldModule.name }}
            />
        )
    }),
)

NumberField.displayName = 'NumberField'

export const numberFieldModule = createEditableComponentModule({
    name: 'number-field',
    label: 'Number field',
    optionsBuilder,
    operatorsForConditions: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    relationsRules: [rules.relations.duplicateValueRule, rules.relations.hiddenRule],
    validationsRules: [rules.validations.editable.isRequiredRule, rules.validations.editable.minNumberRule, rules.validations.editable.maxNumberRule],
    Component: NumberField,
})
