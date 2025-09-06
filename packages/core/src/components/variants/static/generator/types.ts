import { FC } from 'react'

import { AvailableObject, Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { GeneratorComponentProps } from '../../../generator'
import { StaticComponentProperties } from '../schema'

export type StaticComponentPropsAsObject<P extends AvailableObject = AvailableObject> = GeneratorComponentProps<'static', P>

export type StaticComponentProps<B extends GroupOptionsBuilder> = StaticComponentPropsAsObject<OptionsBuilderOutput<B>>

export type StaticComponent<T extends StaticComponentProperties> = FC<Unwrap<StaticComponentPropsAsObject<T>>>
