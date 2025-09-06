import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { NumberInputComponentProperties } from '../schema'

export type NumberInputComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'number-input', P>

export type NumberInputComponentProps<B extends GroupOptionsBuilder> = NumberInputComponentPropsAsObject<OptionsBuilderOutput<B>>

export type NumberInputComponent<T extends NumberInputComponentProperties = NumberInputComponentProperties> = FC<Unwrap<NumberInputComponentPropsAsObject<T>>>
