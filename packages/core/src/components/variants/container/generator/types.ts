import { FC } from 'react'

import { Unwrap } from '@form-crafter/utils'

import { GroupOptionsBuilder, OptionsBuilderOutput } from '../../../../options-builder'
import { ViewComponent } from '../../../../views'
import { GeneratorComponentProps } from '../../../generator'
import { ContainerComponentProperties } from '../schema'

// export type HeaderContainer = FC<HeaderContainerProps>

// export type HeaderContainerProps = {
//     rows: ViewRowChild[]
// }

export type ContainerComponentPropsAsObject<P extends ContainerComponentProperties = ContainerComponentProperties> = GeneratorComponentProps<'container', P> & {
    rows?: ViewComponent['rows']
    onChangeProperties: (changes: Partial<P>) => void
}

export type ContainerComponentProps<B extends GroupOptionsBuilder> = ContainerComponentPropsAsObject<OptionsBuilderOutput<B>>

export type ContainerComponent<T extends ContainerComponentProperties> = FC<Unwrap<ContainerComponentPropsAsObject<T>>>
