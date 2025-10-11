import { forwardRef, memo } from 'react'

import { createDatePickerComponentModule, DatePickerComponentProps } from '@form-crafter/core'
import { builders } from '@form-crafter/options-builder'
import { isNotEmpty } from '@form-crafter/utils'
import { DatePicker as DatePickerBase } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'

import { componentsOperators } from '../../components-operators'
import { rules } from '../../rules'
import { dateInputEules } from '../DateInput'
import { defaultDateFormat } from '../DateInput/consts'

const optionsBuilder = builders.group({
    value: builders.datePicker().label('Значение').required().nullable(),
    readonly: builders.checkbox().label('Только для чтения').required().nullable(),
    label: builders.text().label('Название'),
    disabled: builders.checkbox().label('Блокировка ввода'),
})

type ComponentProps = DatePickerComponentProps<typeof optionsBuilder>

const DatePicker = memo(
    forwardRef<HTMLInputElement, ComponentProps>(
        ({ meta, onChangeProperties, onBlur, isRequired, firstError, properties: { value, label, disabled, readonly } }, ref) => {
            const finalValue = dayjs(value)

            return (
                <DatePickerBase
                    inputRef={ref}
                    value={finalValue}
                    name={meta.formKey}
                    disabled={disabled}
                    label={label}
                    onChange={(newValue) => onChangeProperties({ value: dayjs(newValue).format(defaultDateFormat) })}
                    onClose={onBlur}
                    format={defaultDateFormat}
                    readOnly={!!readonly}
                    slotProps={{
                        textField: {
                            error: isNotEmpty(firstError?.message),
                            helperText: firstError?.message,
                            required: isRequired,
                            readOnly: !!readonly,
                        },
                    }}
                />
            )
        },
    ),
)

DatePicker.displayName = 'DatePicker'

export const datePickerModule = createDatePickerComponentModule({
    name: 'date-picker',
    label: 'Date picker',
    optionsBuilder,
    operators: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.beforeDateOperator,
        componentsOperators.afterDateOperator,
    ],
    mutations: [rules.mutations.duplicateValueRule],
    validations: [
        rules.validations.components.editable.isRequiredRule,
        dateInputEules.validations.minDateRule,
        dateInputEules.validations.maxDateRule,
        dateInputEules.validations.isAdultRule,
        dateInputEules.validations.isDateRule,
    ],
    Component: DatePicker,
})
