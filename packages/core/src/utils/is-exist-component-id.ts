import { isNotEmpty, Maybe } from '@form-crafter/utils'

import { rootComponentId } from '../consts'
import { EntityId } from '../types'

export const isExistComponentId = (id: Maybe<EntityId>): boolean => isNotEmpty(id) && id !== rootComponentId
