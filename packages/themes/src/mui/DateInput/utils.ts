import { ComponentSchema } from '@form-crafter/core'

import { componentName } from './consts'
import { DateInputSchema } from './types'

export const isDateInputSchema = (schema: ComponentSchema): schema is DateInputSchema => schema.meta.name === componentName
