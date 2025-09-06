import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { MultipleSelectComponentProperties } from '../schema'

export type MultipleSelectComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'multiple-select', P>

export type MultipleSelectComponentProps<B extends GroupOptionsBuilder> = MultipleSelectComponentPropsAsObject<OptionsBuilderOutput<B>>

export type MultipleSelectComponent<T extends MultipleSelectComponentProperties = MultipleSelectComponentProperties> = FC<
    Unwrap<MultipleSelectComponentPropsAsObject<T>>
>
