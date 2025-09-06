import { GroupOptionsBuilder } from '../../../../../options-builder'
import { MultipleSelectComponentProperties } from '../schema'
import { MultipleSelectComponentModule } from './types'

export const createMultipleSelectComponentModule = <O extends GroupOptionsBuilder<MultipleSelectComponentProperties>>(
    params: MultipleSelectComponentModule<O>,
): MultipleSelectComponentModule<GroupOptionsBuilder<MultipleSelectComponentProperties>> => {
    return params
}
