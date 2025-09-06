import { FC } from 'react'

import { EntityId, ViewComponentChild } from '@form-crafter/core'

export type ResolverComponentType = FC<Pick<ViewComponentChild, 'id'> & { rowId: EntityId }>
