import { isEmpty, isNull, isString } from '@form-crafter/utils'

import { ValidationRule } from '../types'

export type IsRequiredRuleSchema = {
    ruleName: 'isRequired'
    options: {
        skipNull: any // CheckboxOptionConfig['value']
        withTrim: any // CheckboxOptionConfig['value']
        message: any // InputOptionConfig['value']
    }
}

export const isRequiredRule: ValidationRule<IsRequiredRuleSchema> = {
    ruleName: 'isRequired',
    kind: 'component',
    ruleDisplayName: 'Обязательное поле',
    validate: (value, { options }) => {
        const { skipNull, withTrim, message } = options

        if (skipNull && isNull(value)) {
            return null
        }

        if (withTrim && isString(value) && isEmpty(value.trim())) {
            return message
        }

        return isEmpty(value) ? message : null
    },
}
