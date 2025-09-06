import { GroupOptionsBuilder } from '../../../../../options-builder'
import { DateRangeComponentProperties } from '../schema'
import { DateRangeComponentModule } from './types'

export const createDateRangeComponentModule = <O extends GroupOptionsBuilder<DateRangeComponentProperties>>(
    params: DateRangeComponentModule<O>,
): DateRangeComponentModule<GroupOptionsBuilder<DateRangeComponentProperties>> => {
    return params
}
