// import { isArray, isString } from '@form-crafter/utils'

// import { ValidationRule } from '../types'

// export type MaxLengthRuleSchema = {
//     ruleName: 'maxLength'
//     options: {
//         maxLength: any // MaskInputOptionConfig<number>['value']
//         message: any // InputOptionConfig['value']
//     }
// }

// export const maxLengthRule: ValidationRule<MaxLengthRuleSchema> = {
//     ruleName: 'maxLength',
//     kind: 'component',
//     ruleDisplayName: 'Минимальная длина',
//     validate: (value, { options }) => {
//         const { message, maxLength } = options
//         const errorMessage = message.replace('{maxLength}', maxLength.toString())

//         if (isString(value) && value.trim().length > maxLength) {
//             return errorMessage
//         }

//         if (isArray(value) && value.length > maxLength) {
//             return errorMessage
//         }

//         return null
//     },
// }
