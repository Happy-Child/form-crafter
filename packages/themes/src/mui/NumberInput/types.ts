import { NumberInputComponentProps as NumberInputComponentPropsBase, NumberInputComponentSchema } from '@form-crafter/core'

import { optionsBuilder } from './options-builder'

export type NumberInputComponentProps = NumberInputComponentPropsBase<typeof optionsBuilder>

export type NumberInputSchema = NumberInputComponentSchema<NumberInputComponentProps['properties']>
