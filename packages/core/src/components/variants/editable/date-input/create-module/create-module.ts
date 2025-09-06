import { GroupOptionsBuilder } from '../../../../../options-builder'
import { DateInputComponentProperties } from '../schema'
import { DateInputComponentModule } from './types'

export const createDateInputComponentModule = <O extends GroupOptionsBuilder<DateInputComponentProperties>>(
    params: DateInputComponentModule<O>,
): DateInputComponentModule<GroupOptionsBuilder<DateInputComponentProperties>> => {
    return params
}
