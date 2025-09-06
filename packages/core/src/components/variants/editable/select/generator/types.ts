import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { SelectComponentProperties } from '../schema'

export type SelectComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'select', P>

export type SelectComponentProps<B extends GroupOptionsBuilder> = SelectComponentPropsAsObject<OptionsBuilderOutput<B>>

export type SelectComponent<T extends SelectComponentProperties = SelectComponentProperties> = FC<Unwrap<SelectComponentPropsAsObject<T>>>
