import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { DateInputComponentProperties } from '../schema'

export type DateInputComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'date-input', P>

export type DateInputComponentProps<B extends GroupOptionsBuilder> = DateInputComponentPropsAsObject<OptionsBuilderOutput<B>>

export type DateInputComponent<T extends DateInputComponentProperties = DateInputComponentProperties> = FC<Unwrap<DateInputComponentPropsAsObject<T>>>
