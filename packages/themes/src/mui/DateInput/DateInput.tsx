import { forwardRef, memo, useMemo } from 'react'

import { createDateInputComponentModule, MaskOptions } from '@form-crafter/core'
import { MaskitoDateMode, maskitoDateOptionsGenerator } from '@maskito/kit'

import { GeneralMaskInput } from '../../components'
import { componentsOperators } from '../../components-operators'
import { rules as generalRules } from '../../rules'
import { textInputModule } from '../TextInput'
import { componentName, defaultMode } from './consts'
import { optionsBuilder } from './options-builder'
import { rules } from './rules'
import { DateInputComponentProps } from './types'

const { Component: TextField } = textInputModule

const DateInput = memo(
    forwardRef<HTMLInputElement, DateInputComponentProps>(({ properties: { pattern, showMask, ...properties }, ...props }, ref) => {
        const maskOptions: MaskOptions = useMemo(
            () =>
                maskitoDateOptionsGenerator({
                    mode: (pattern as MaskitoDateMode) || defaultMode,
                }),
            [pattern],
        )

        return <GeneralMaskInput ref={ref} {...props} maskOptions={maskOptions} Component={TextField} properties={properties} showMask={showMask} />
    }),
)

DateInput.displayName = 'DateInput'

export const dateInputModule = createDateInputComponentModule({
    name: componentName,
    label: 'Date field',
    optionsBuilder,
    operators: [
        componentsOperators.isEmptyOperator,
        componentsOperators.isNotEmptyOperator,
        componentsOperators.beforeDateOperator,
        componentsOperators.afterDateOperator,
    ],
    validations: [rules.validations.minDateRule, rules.validations.maxDateRule, generalRules.validations.components.editable.isRequiredRule],
    Component: DateInput,
})
