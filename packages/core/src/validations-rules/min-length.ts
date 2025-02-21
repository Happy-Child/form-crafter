import { isArray, isString } from '@form-crafter/utils'

import { ValidationRule } from '../types'

export type MinLengthRuleSchema = {
    ruleName: 'minLength'
    options: {
        minLength: any // MaskInputOptionConfig<number>['value']
        message: any // InputOptionConfig['value']
    }
}

export const minLengthRule: ValidationRule<MinLengthRuleSchema> = {
    ruleName: 'minLength',
    kind: 'component',
    ruleDisplayName: 'Минимальная длина',
    validate: (value, { options }) => {
        const { message, minLength } = options
        const errorMessage = message.replace('{minLength}', minLength.toString())

        if (isString(value) && value.trim().length < minLength) {
            return errorMessage
        }

        if (isArray(value) && value.length < minLength) {
            return errorMessage
        }

        return null
    },
}
