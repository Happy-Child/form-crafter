import { GroupOptionsBuilder } from '../../../../options-builder'
import { StaticComponentProperties } from '../schema'
import { StaticComponentModule } from './types'

export const createStaticComponentModule = <O extends GroupOptionsBuilder<StaticComponentProperties>>(
    params: StaticComponentModule<O>,
): StaticComponentModule<GroupOptionsBuilder<StaticComponentProperties>> => {
    return params
}
