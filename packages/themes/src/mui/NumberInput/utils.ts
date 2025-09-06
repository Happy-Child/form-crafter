import { ComponentSchema } from '@form-crafter/core'

import { componentName } from './consts'
import { NumberInputSchema } from './types'

export const isNumberInputSchema = (schema: ComponentSchema): schema is NumberInputSchema => schema.meta.name === componentName
