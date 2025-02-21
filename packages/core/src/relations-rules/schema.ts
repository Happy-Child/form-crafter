// Как добавить правила для добавления id компонента?
// Поле а б и c. Учавствуют в правила а и с. Если изменяются другие поля нужно ли запускать правило на поле б?
// с async что? по умолчанию сделать async?
// цепочка ок работает?
// Большая проблема с тем, как понять какое занчение атрибута после отмены правила возвращать? что было до

// type FormIoDeps = {
//     'input': {
//         conditionalOperators: {
//             isEqual: string,
//             isNotEqual: string,
//             isEmpty: null,
//             isNotEmpty: null,
//             includes: string,
//             notIncludes: string,
//             endsWith: string,
//             startsWith: string,
//             equalOneOf: ComponentId[],
//         },
//     },
//     'textarea': {
//         conditionalOperators: {
//             isEqual: string,
//             isNotEqual: string,
//             isEmpty: null,
//             isNotEmpty: null,
//             includes: string,
//             notIncludes: string,
//             endsWith: string,
//             startsWith: string,
//         },
//     },
//     'number': {
//         isEqual: string,
//         isNotEqual: string,
//         isEmpty: null,
//         isNotEmpty: null,
//         lessThan: number,
//         greaterThan: number,
//         lessThanOrEqual: number,
//         greaterThanOrEqual: number,
//     },
//     'checkbox': {
//         isEqual: 'checked' | 'notChecked',
//     },
//     'selectBoxes': { // multi-checkbox
//         isEqual: string, // from select
//         isNotEqual: string, // from select
//         isEmpty: null,
//         isNotEmpty: null,
//     }
// };

// disable
// readonly
// смена view
// дублирование значения всегда либо по условиям (а поле можно редактировать будет после этого?)
// просто установка value в поле (а поле можно редактировать будет после этого?)
// сумма (другая операция над) значений других полей (от 1 и больше), вычисляемое занчение хороший кейс
// Заполнение значений в выпадающем списке или автокомплите на основе значения другого компонента
// Изменение формата ввода

// export enum WhenApplyRelationRule {
//     ifOneFulfilled = 'ifOneFulfilled',
//     ifAllFulfilled = 'ifAllFulfilled',
// }

// export type ConditionRelationRule = {
//     componentId: ComponentId;
//     value: string;
// } | {
//     componentId: ComponentId;
//     valueFromComponentId: ComponentId;
// };

// export type RelationRuleSchema = {
//     ruleName: string,
//     options: {
//         conditions?: {
//             whenApply: WhenApplyRelationRule,
//             list: ConditionRelationRule[],
//         },
//     },
// }

// // TODO закончил реализицию RelationRuleSchema и начал думать над тем, как описанить схемой рендеринга options
// // но упёрся в то, что не понятно как описать неоязяат объект conditions. Пошёл в validation option config
// export const DuplicationValueRelationRuleSchema: RelationRuleSchema = {
//     ruleName: 'duplicationValue',
//     kind: 'component',
//     options: {

//     },
// }

// export type ChangeViewRelationRuleSchema = {
//     ruleName: 'changeView',
//     kind: 'form';
//     options: {
//         conditions: {
//             whenApply: WhenApplyRelationRule,
//             list: ConditionRelationRule[],
//         },
//     },
// }

// export type DuplicationValueRelationRuleSchema = {
//     ruleName: 'duplicationValue',
//     kind: 'component';
//     options: {
//         fromComponentId: ComponentId,
//         conditions?: {
//             whenApply: WhenApplyRelationRule,
//             list: ConditionRelationRule[],
//         },
//     },
// }

// export type RelationRule<T extends object = any, V = ComponentSchemaValue> =
//     | {
//           ruleName: string
//           kind: 'component'
//           ruleDisplayName: string
//           execute: (
//               value: V,
//               params: {
//                   componentId: ComponentId
//                   options: T
//                   fieldsProperties: ComponentsPropertiesData
//                   fieldsTree: ComponentsTree
//               },
//           ) => string | null
//       }
//     | {
//           ruleName: string
//           kind: 'form'
//           ruleDisplayName: string
//           execute: (params: { options: T; fieldsProperties: ComponentsPropertiesData; fieldsTree: ComponentsTree }) => string | null
//       }
