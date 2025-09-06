import { GroupOptionsBuilder } from '../../../../../options-builder'
import { SelectComponentProperties } from '../schema'
import { SelectComponentModule } from './types'

export const createSelectComponentModule = <O extends GroupOptionsBuilder<SelectComponentProperties>>(
    params: SelectComponentModule<O>,
): SelectComponentModule<GroupOptionsBuilder<SelectComponentProperties>> => {
    return params
}
