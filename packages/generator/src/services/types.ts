import { Schema } from '@form-crafter/core'
import { AvailableObject } from '@form-crafter/utils'

import { ThemeServiceParams } from './theme'

export type RootServicesParams = ThemeServiceParams & {
    schema: Schema
    onSubmit: (schema: AvailableObject) => void
}
