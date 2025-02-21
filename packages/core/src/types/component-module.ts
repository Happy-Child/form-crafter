import { ComponentProperties, FormCrafterComponent } from './components'
import { ComponentType } from './general'
import { OptionsBuilder, OptionsBuilderOutput } from './options-builder'

export type ComponentModule<
    T extends ComponentType = ComponentType,
    O extends OptionsBuilder<ComponentProperties<T>> = OptionsBuilder<ComponentProperties<T>>,
> = {
    name: string
    label: string
    type: T
    optionsBuilder: O extends OptionsBuilder<ComponentProperties<T>> ? O : never
    Component: FormCrafterComponent<T, OptionsBuilderOutput<O>>
}
