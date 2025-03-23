import { ComponentProperties, FormCrafterComponent } from './components'
import { ComponentOperator } from './components-operators'
import { OptionsBuilder, OptionsBuilderOutput } from './options-builder'
import { ComponentType } from './types'

export type ComponentModule<
    T extends ComponentType = ComponentType,
    O extends OptionsBuilder<ComponentProperties<T>> = OptionsBuilder<ComponentProperties<T>>,
> = {
    name: string
    label: string
    type: T
    optionsBuilder: O extends OptionsBuilder<ComponentProperties<T>> ? O : never
    operatorsForConditions?: ComponentOperator[]
    Component: FormCrafterComponent<T, OptionsBuilderOutput<O>>
}

type CreateComponentModuleParams<T extends ComponentType, O extends OptionsBuilder<ComponentProperties<T>>> = ComponentModule<T, O>

// TODO check components operators by type

export const createComponentModule = <T extends ComponentType, O extends OptionsBuilder<ComponentProperties<T>>>(params: CreateComponentModuleParams<T, O>) => {
    return params
}
