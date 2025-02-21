import { EntityId, ViewComponentChild } from '@form-crafter/core'
import { FC } from 'react'

export type ResolverComponentType = FC<Pick<ViewComponentChild, 'id'> & { rowId: EntityId }>
