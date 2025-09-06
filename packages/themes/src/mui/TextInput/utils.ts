import { ComponentSchema } from '@form-crafter/core'

import { componentName } from './consts'
import { TextInputSchema } from './types'

export const isTextInputSchema = (schema: ComponentSchema): schema is TextInputSchema => schema.meta.name === componentName
