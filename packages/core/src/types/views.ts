import { ColSpan, EntityId, ResponsiveSizes } from './general'

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

export type ViewDefinitionRows = Record<EntityId, ViewRow>
export type ViewDefinitionComponents = Record<EntityId, ViewComponent>
export type ViewDefinition = {
    rows: ViewDefinitionRows
    components: ViewDefinitionComponents
}

export type ViewsDefinitions = Record<EntityId, ViewDefinition>
export type Views = {
    initialViewId: EntityId
    definitions: ViewsDefinitions
}
