import { FC } from 'react'

import { Unwrap } from '@form-crafter/utils'
import { EntityId } from 'packages/core/src/types'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { GeneratorComponentProps } from '../../../generator'
import { ContainerComponentProperties } from '../schema'

// export type HeaderContainer = FC<HeaderContainerProps>

// export type HeaderContainerProps = {
//     rows: ViewRowChild[]
// }

export type ContainerComponentPropsAsObject<P extends ContainerComponentProperties = ContainerComponentProperties> = GeneratorComponentProps<'container', P> & {
    childrenRows?: EntityId[]
    onChangeProperties: (changes: Partial<P>) => void
}

export type ContainerComponentProps<B extends GroupOptionsBuilder> = ContainerComponentPropsAsObject<OptionsBuilderOutput<B>>

export type ContainerComponent<T extends ContainerComponentProperties> = FC<Unwrap<ContainerComponentPropsAsObject<T>>>
