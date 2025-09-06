import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { DatePickerComponentProperties } from '../schema'

export type DatePickerComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'date-picker', P>

export type DatePickerComponentProps<B extends GroupOptionsBuilder> = DatePickerComponentPropsAsObject<OptionsBuilderOutput<B>>

export type DatePickerComponent<T extends DatePickerComponentProperties = DatePickerComponentProperties> = FC<Unwrap<DatePickerComponentPropsAsObject<T>>>
