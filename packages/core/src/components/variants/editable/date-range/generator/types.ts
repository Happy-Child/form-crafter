import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { DateRangeComponentProperties } from '../schema'

export type DateRangeComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'date-range', P>

export type DateRangeComponentProps<B extends GroupOptionsBuilder> = DateRangeComponentPropsAsObject<OptionsBuilderOutput<B>>

export type DateRangeComponent<T extends DateRangeComponentProperties = DateRangeComponentProperties> = FC<Unwrap<DateRangeComponentPropsAsObject<T>>>
