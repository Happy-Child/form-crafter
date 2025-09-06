import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { TextInputComponentProperties } from '../schema'

export type TextInputComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'text-input', P>

export type TextInputComponentProps<B extends GroupOptionsBuilder> = TextInputComponentPropsAsObject<OptionsBuilderOutput<B>>

export type TextInputComponent<T extends TextInputComponentProperties = TextInputComponentProperties> = FC<Unwrap<TextInputComponentPropsAsObject<T>>>
