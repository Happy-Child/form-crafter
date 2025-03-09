// import { ConditionOperator } from './conditions-operators/types'
import { ComponentProperties, ComponentType, FormCrafterComponent, OptionsBuilder, OptionsBuilderOutput } from './types'

export type ComponentModule<
    T extends ComponentType = ComponentType,
    O extends OptionsBuilder<ComponentProperties<T>> = OptionsBuilder<ComponentProperties<T>>,
> = {
    name: string
    label: string
    type: T
    optionsBuilder: O extends OptionsBuilder<ComponentProperties<T>> ? O : never
    // conditionsOperators: ConditionOperator[]
    Component: FormCrafterComponent<T, OptionsBuilderOutput<O>>
}

export type CreateComponentModuleParams<
    T extends ComponentType = ComponentType,
    O extends OptionsBuilder<ComponentProperties<T>> = OptionsBuilder<ComponentProperties<T>>,
> = ComponentModule<T, O>

export const createComponentModule = <T extends ComponentType, O extends OptionsBuilder<any>>(params: CreateComponentModuleParams<T, O>) => {
    return params
}
