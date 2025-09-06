import { TextInputComponentProps as TextInputComponentPropsBase, TextInputComponentSchema } from '@form-crafter/core'

import { optionsBuilder } from './options-builder'

export type TextInputComponentProps = TextInputComponentPropsBase<typeof optionsBuilder>

export type TextInputSchema = TextInputComponentSchema<TextInputComponentProps['properties']>
