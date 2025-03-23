// import { isEmpty, isNull, isString } from '@form-crafter/utils'

// import { ValidationRule } from '../types'

// НУЖНО VALIDATION SCHRMA УКАЗАТЬ В КОМПОНЕНТ SCHEMA
// А В УКОНЕВОМ SCHEMA validation rule

// VALIDATION SCHRMA - отдлькео тип?

// IsRequiredRuleSchema не нужнно пписывать внутрую, это будет optinos builder и всё, + CONDITIONS

// OPTIONS BUILDER добавить билдеры для вбора компонентов:
// - просмотреть validation Target, сможем ли авсё реализовать что там есть?
// - нужно ли делать добаврение компонента не multiselect а multifield? если да, то как убирать не комп. которые уже выбраны
// - какие ещё могут быть проблемы

// export type ValidationRulePayload = {
//     ruleName: string
//     options: Record<string, any>
//     conditions: Condition[]
// }

// export const isRequiredRule: ValidationRule<IsRequiredRuleSchema> = {
//     ruleName: 'isRequired',
//     kind: 'component',
//     ruleDisplayName: 'Обязательное поле',
//     validate: (value, { options }) => {
//         const { skipNull, withTrim, message } = options

//         if (skipNull && isNull(value)) {
//             return null
//         }

//         if (withTrim && isString(value) && isEmpty(value.trim())) {
//             return message
//         }

//         return isEmpty(value) ? message : null
//     },
// }
