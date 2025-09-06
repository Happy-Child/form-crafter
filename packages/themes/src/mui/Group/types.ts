import { ContainerComponentProps as ContainerComponentPropsBase } from '@form-crafter/core'

import { optionsBuilder } from './options-builder'

export type ContainerComponentProps = ContainerComponentPropsBase<typeof optionsBuilder>
