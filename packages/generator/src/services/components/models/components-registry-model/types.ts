import { EntityId } from '@form-crafter/core'

export type ChildrenOfRepeater = {
    type: 'repeater'
    children: Set<EntityId>
}

export type ChildrenOfContainer = {
    type: 'container'
    children: Set<EntityId>
    childrenByTemplateId: Record<EntityId, EntityId>
}

export type ChildrenOfComponents = Record<EntityId, ChildrenOfRepeater | ChildrenOfContainer>
