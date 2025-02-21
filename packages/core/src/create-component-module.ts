import { ComponentModule, ComponentType, OptionsBuilder } from './types'

export const createComponentModule = <T extends ComponentType, O extends OptionsBuilder<any>>(params: ComponentModule<T, O>) => {
    return params
}
