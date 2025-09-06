import { GroupOptionsBuilder } from '../../../../../options-builder'
import { DatePickerComponentProperties } from '../schema'
import { DatePickerComponentModule } from './types'

export const createDatePickerComponentModule = <O extends GroupOptionsBuilder<DatePickerComponentProperties>>(
    params: DatePickerComponentModule<O>,
): DatePickerComponentModule<GroupOptionsBuilder<DatePickerComponentProperties>> => {
    return params
}
