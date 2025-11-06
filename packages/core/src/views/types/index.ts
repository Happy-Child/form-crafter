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

export type ViewContent = {
    elements: ViewElements
}

export type ViewResponsive = {
    xxl: ViewContent
} & Partial<Record<Exclude<Breakpoint, 'xxl'>, ViewContent>>

export type ViewDefinition = {
    id: EntityId
    condition: ConditionNode
    responsive: ViewResponsive
}

export type Views = {
    default: ViewResponsive
    additionals?: Record<string, ViewDefinition>
}
