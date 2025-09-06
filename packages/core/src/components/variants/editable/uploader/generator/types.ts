import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../../options-builder'
import { EditableComponentPropsAsObject } from '../../types'
import { UploaderComponentProperties } from '../schema'

export type UploaderComponentPropsAsObject<P extends AvailableObject = AvailableObject> = EditableComponentPropsAsObject<'uploader', P>

export type UploaderComponentProps<B extends GroupOptionsBuilder> = UploaderComponentPropsAsObject<OptionsBuilderOutput<B>>

export type UploaderComponent<T extends UploaderComponentProperties> = FC<Unwrap<UploaderComponentPropsAsObject<T>>>
