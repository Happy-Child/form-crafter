import { GroupOptionsBuilder } from '../../../../options-builder'
import { ContainerComponentProperties } from '../schema'
import { ContainerComponentModule } from './types'

export const createContainerComponentModule = <O extends GroupOptionsBuilder<ContainerComponentProperties>>(
    params: ContainerComponentModule<O>,
): ContainerComponentModule<GroupOptionsBuilder<ContainerComponentProperties>> => {
    return params
}
