import { EntityId } from '@form-crafter/core'

import { genId } from './gen-id'

export const genRowId = (): EntityId => genId({ prefix: 'row' })
