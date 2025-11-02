import { ConditionNode } from '../../conditions'
import { Breakpoint, ColSpan, EntityId } from '../../types'

export type ViewComponentLayout = {
    col: ColSpan
}

export type ViewElementRow = {
    id: EntityId
    type: 'row'
    children?: ViewElementComponent[]
}

export type ViewElementComponent = {
    id: EntityId
    type: 'component'
    layout: ViewComponentLayout
    children?: ViewElements
}

export type ViewElements = ViewElementRow[]

export type ViewContent<T extends 'default' | 'template' = 'default'> = {
    elements: T extends 'default' ? ViewElements : [ViewElementRow]
}

export type ViewResponsive<T extends 'default' | 'template' = 'default'> = {
    xxl: ViewContent<T>
} & Partial<Record<Exclude<Breakpoint, 'xxl'>, ViewContent<T>>>

export type ViewDefinition<T extends 'default' | 'template' = 'default'> = {
    id: EntityId
    condition: ConditionNode
    responsive: ViewResponsive<T>
}

export type Views<T extends 'default' | 'template' = 'default'> = {
    default: ViewResponsive<T>
    additionals?: Record<string, ViewDefinition<T>>
}
