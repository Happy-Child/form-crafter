import { ConditionNode } from '../../conditions'
import { Breakpoint, ColSpan, EntityId, ResponsiveSizes } from '../../types'

export type ViewComponentChild = { id: EntityId }

export type ViewRowChild = { id: EntityId }

export type ViewComponentLayout = {
    col: ResponsiveSizes<ColSpan>
}

export type ViewComponentParams = {
    layout?: ViewComponentLayout
}

export type ViewComponentWithRows = {
    id: EntityId
    parentId?: EntityId
    params?: ViewComponentParams
    rows: ViewRowChild[]
}

export type ViewComponentWithParent = {
    id: EntityId
    parentId: EntityId
    params?: ViewComponentParams
    rows?: ViewRowChild[]
}

export type ViewComponentDefault = {
    id: EntityId
    parentId?: EntityId
    params?: ViewComponentParams
    rows?: ViewRowChild[]
}

export type ViewComponent = ViewComponentDefault | ViewComponentWithParent | ViewComponentWithRows

export type ViewRow = {
    id: EntityId
    children: ViewComponentChild[]
}

export type ViewElements = {
    rows: ViewDefinitionRows
    components: ViewDefinitionComponents
}

export type ViewDefinitionRows = Record<EntityId, ViewRow>

export type ViewDefinitionComponents = Record<EntityId, ViewComponent>

export type ViewResponsive = {
    xxl: ViewElements
} & Partial<Record<Exclude<Breakpoint, 'xxl'>, ViewElements>>

export type ViewDefinition = {
    id: EntityId
    condition: ConditionNode
    responsive: ViewResponsive
}

export type Views = {
    default: ViewResponsive
    additionals?: ViewDefinition[]
}
