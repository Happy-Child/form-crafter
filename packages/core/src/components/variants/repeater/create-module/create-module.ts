import { GroupOptionsBuilder } from '../../../../options-builder'
import { RepeaterComponentProperties } from '../schema'
import { RepeaterComponentModule } from './types'

export const createRepeaterComponentModule = <O extends GroupOptionsBuilder<RepeaterComponentProperties>>(
    params: RepeaterComponentModule<O>,
): RepeaterComponentModule<GroupOptionsBuilder<RepeaterComponentProperties>> => {
    return params
}
