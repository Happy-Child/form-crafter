import { DateRangeComponentProps as DateRangeComponentPropsBase, DateRangeComponentSchema } from '@form-crafter/core'

import { optionsBuilder } from './options-builder'

export type DateRangeComponentProps = DateRangeComponentPropsBase<typeof optionsBuilder>

export type DateRangeSchema = DateRangeComponentSchema<DateRangeComponentProps['properties']>
