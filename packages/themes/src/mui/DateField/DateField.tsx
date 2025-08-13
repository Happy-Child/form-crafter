import { createEditableComponentModule, EditableComponentProps, MaskOptions, OptionsBuilderOutput } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { MaskitoDateMode, maskitoDateOptionsGenerator } from '@maskito/kit'
import { forwardRef, memo, useMemo } from 'react'

import { GeneralMaskInput } from '../../components'
import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'
import { textFieldModule } from '../TextField'

const { Component: TextField } = textFieldModule

const defaultMode: MaskitoDateMode = 'dd/mm/yyyy'

const optionsBuilder = builders.group({
    value: builders.date().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения').required().nullable(),
    label: builders.text().label('Название'),
    placeholder: builders.text().label('Название'),
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

type ComponentProps = EditableComponentProps<OptionsBuilderOutput<typeof optionsBuilder>>

const DateField = memo(
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
                Component={TextField}
                properties={properties}
                showMask={showMask}
                meta={{ ...meta, name: textFieldModule.name }}
            />
        )
    }),
)

DateField.displayName = 'DateField'

export const dateFieldModule = createEditableComponentModule({
    name: 'date-field',
    label: 'Date field',
    optionsBuilder,
    operatorsForConditions: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.beforeDateOperator,
        componentsOperators.afterDateOperator,
    ],
    mutationsRules: [rules.mutations.duplicateValueRule],
    validationsRules: [rules.validations.editable.isRequiredRule, rules.validations.editable.minDateRule, rules.validations.editable.maxDateRule],
    Component: DateField,
})
