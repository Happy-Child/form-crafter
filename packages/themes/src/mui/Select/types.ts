import { SelectComponentProps as SelectComponentPropsBase } from '@form-crafter/core'

import { optionsBuilder } from './options-builder'

export type SelectComponentProps = SelectComponentPropsBase<typeof optionsBuilder>
