import { EventCallable, Store, StoreWritable } from 'effector'

import { ComponentValidationError } from '../../../components'
import { EntityId } from '../../general'

export type ComponentsValidationErrors = Record<EntityId, Map<EntityId, ComponentValidationError>>

export type SetComponentValidationErrorsPayload = { componentId: EntityId; errors: ComponentsValidationErrors[keyof ComponentsValidationErrors] }

export type ComponentsValidationErrorsModel = {
    setComponentErrors: EventCallable<SetComponentValidationErrorsPayload>
    setComponentsGroupsErrors: EventCallable<ComponentsValidationErrors>
    removeComponentsErrors: EventCallable<Set<EntityId>>
    removeAllComponentsErrors: EventCallable<Set<EntityId>>
    removeAllErrors: EventCallable<void>
    filterAllErrors: EventCallable<Set<string>>
    clearComponentsGroupsErrors: EventCallable<void>
    $componentsGroupsErrors: StoreWritable<ComponentsValidationErrors>
    $componentsErrors: StoreWritable<ComponentsValidationErrors>
    $mergedErrors: StoreWritable<ComponentsValidationErrors>
    $visibleErrors: Store<ComponentsValidationErrors>
}
