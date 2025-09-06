import { forwardRef, memo, useCallback, useMemo } from 'react'

import { createDateRangeComponentModule } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { DateRangePicker as DateRangePickerBase } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'

import { componentsOperators } from '../../components-operators'
import { rules as generalRules } from '../../rules'
import { componentName } from './consts'
import { optionsBuilder } from './options-builder'
import { rules } from './rules'
import { DateRangeComponentProps } from './types'

const DateRange = memo(
    forwardRef<HTMLInputElement, DateRangeComponentProps>(
        ({ meta, onChangeProperties, onBlur, isRequired, firstError, properties: { value, format, label, disabled, readonly } }, ref) => {
            const finalValue = useMemo(() => {
                const start = dayjs(value?.start)
                const end = dayjs(value?.end)
                return [start.isValid() ? start : null, end.isValid() ? end : null] as Parameters<typeof DateRangePickerBase>[0]['value']
            }, [value])

            const handleChange: Required<Parameters<typeof DateRangePickerBase>[0]>['onChange'] = useCallback(
                ([from, to]) => {
                    console.log('range value: ', from, to)
                    const start = dayjs(from)?.toISOString() || null
                    const end = dayjs(to)?.toISOString() || null
                    onChangeProperties({ value: { start, end } })
                },
                [onChangeProperties],
            )

            return (
                <DateRangePickerBase
                    inputRef={ref}
                    value={finalValue}
                    name={meta.formKey}
                    disabled={disabled}
                    label={label}
                    onChange={handleChange}
                    onClose={onBlur}
                    format={format}
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

DateRange.displayName = 'DateRange'

export const dateRangeModule = createDateRangeComponentModule({
    name: componentName,
    label: 'Date range',
    optionsBuilder,
    operators: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.beforeDateOperator,
        componentsOperators.afterDateOperator,
    ],
    mutations: [generalRules.mutations.duplicateValueRule],
    validations: [rules.validations.isRequiredRule],
    Component: DateRange,
})
