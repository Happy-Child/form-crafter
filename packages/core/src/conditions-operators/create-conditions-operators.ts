// import { ConditionOperator, GeneralConditionOperator } from './types'

// export type EditableConditionOperator = any

// export type EditableConditionOperatorParams<
//     T extends ComponentType = ComponentType,
//     O extends OptionsBuilder<ComponentProperties<T>> = OptionsBuilder<ComponentProperties<T>>,
// > = {
//     name: string
//     label: string
//     type: T
//     optionsBuilder: O extends OptionsBuilder<ComponentProperties<T>> ? O : never
//     conditionsOperators: ConditionOperator[]
//     Component: FormCrafterComponent<T, OptionsBuilderOutput<O>>
// }

// export const createEditableConditionOperator = (params: EditableConditionOperatorParams): EditableConditionOperator => {
//     return {}
// }

// const asd = createEditableConditionOperator({
//     name: 'numberBetween',
//     displayName: 'В промежутке чисел',
//     helpText: 'Выполнится если значение компонента окажется в заданном диапазоне чисел (включительно)',
//     execute: () => {},
//     renderValue допустим
// })
