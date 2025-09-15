import { EntityId } from '@form-crafter/core'

import { genId } from './gen-id'

export const genComponentId = (prefix: string): EntityId => genId({ prefix })
