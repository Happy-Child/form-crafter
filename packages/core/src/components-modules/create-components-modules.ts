import { GroupOptionsBuilder } from '../options-builder'
import {
    ContainerComponentProperties,
    EditableComponentProperties,
    RepeaterComponentProperties,
    StaticComponentProperties,
    UploaderComponentProperties,
} from '../types'
import { ContainerComponentModule, EditableComponentModule, RepeaterComponentModule, StaticComponentModule, UploaderComponentModule } from './types'

export const createEditableComponentModule = <O extends GroupOptionsBuilder<EditableComponentProperties>>(
    params: EditableComponentModule<O>,
): EditableComponentModule<GroupOptionsBuilder<EditableComponentProperties>> => {
    return params
}

export const createContainerComponentModule = <O extends GroupOptionsBuilder<ContainerComponentProperties>>(
    params: ContainerComponentModule<O>,
): ContainerComponentModule<GroupOptionsBuilder<ContainerComponentProperties>> => {
    return params
}

export const createRepeaterComponentModule = <O extends GroupOptionsBuilder<RepeaterComponentProperties>>(
    params: RepeaterComponentModule<O>,
): RepeaterComponentModule<GroupOptionsBuilder<RepeaterComponentProperties>> => {
    return params
}

export const createUploaderComponentModule = <O extends GroupOptionsBuilder<UploaderComponentProperties>>(
    params: UploaderComponentModule<O>,
): UploaderComponentModule<GroupOptionsBuilder<UploaderComponentProperties>> => {
    return params
}

export const createStaticComponentModule = <O extends GroupOptionsBuilder<StaticComponentProperties>>(
    params: StaticComponentModule<O>,
): StaticComponentModule<GroupOptionsBuilder<StaticComponentProperties>> => {
    return params
}
