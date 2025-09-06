import { ComponentSchema } from '@form-crafter/core'

import { componentName } from './consts'
import { DateRangeSchema } from './types'

export const isDateRangeSchema = (schema: ComponentSchema): schema is DateRangeSchema => schema.meta.name === componentName
