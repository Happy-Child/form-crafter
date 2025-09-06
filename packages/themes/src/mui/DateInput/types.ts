import { DateInputComponentProps as DateInputComponentPropsBase, DateInputComponentSchema } from '@form-crafter/core'

import { optionsBuilder } from './options-builder'

export type DateInputComponentProps = DateInputComponentPropsBase<typeof optionsBuilder>

export type DateInputSchema = DateInputComponentSchema<DateInputComponentProps['properties']>
