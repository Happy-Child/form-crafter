import { forwardRef, memo } from 'react'

import { createNumberInputComponentModule } from '@form-crafter/core'

import { GeneralMaskInput } from '../../components'
import { componentsOperators } from '../../components-operators'
import { rules as generalRules } from '../../rules'
import { textInputModule } from '../TextInput'
import { componentName, maskOptions } from './consts'
import { optionsBuilder } from './options-builder'
import { rules } from './rules'
import { NumberInputComponentProps } from './types'

const { Component: TextInput } = textInputModule

const NumberInput = memo(
    forwardRef<HTMLInputElement, NumberInputComponentProps>(({ properties, ...props }, ref) => {
        return <GeneralMaskInput ref={ref} {...props} maskOptions={maskOptions} Component={TextInput} properties={properties} />
    }),
)

NumberInput.displayName = 'NumberInput'

export const numberInputModule = createNumberInputComponentModule({
    name: componentName,
    label: 'Number field',
    optionsBuilder,
    operators: [componentsOperators.isEmptyOperator, componentsOperators.isNotEmptyOperator],
    mutations: [generalRules.mutations.duplicateValueRule, generalRules.mutations.clearValueRule],
    validations: [rules.validations.minNumberRule, rules.validations.maxNumberRule, generalRules.validations.components.editable.isRequiredRule],
    Component: NumberInput,
})
