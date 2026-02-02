import { AvailableObject } from '@form-crafter/utils'
import { Effect, EventCallable, Store, StoreWritable } from 'effector'

import {
    ComponentSchema,
    ComponentsSchemas,
    ComponentValidationError,
    ContainerComponentProperties,
    ContainerComponentSchema,
    EditableComponentProperties,
    EditableComponentSchema,
    RepeaterComponentSchema,
    StaticComponentSchema,
    UploaderComponentProperties,
    UploaderComponentSchema,
} from '../../../components'
import { ConditionNode } from '../../../conditions'
import { RuleExecutorContext } from '../../../rules'
import { EntityId } from '../../general'
import { ComponentsValidationErrors } from './components-validation-errors-model'

export type GetExecutorContextBuilder = Store<(params?: { componentsSchemas?: ComponentsSchemas }) => RuleExecutorContext>

export type GetIsConditionSuccessfulChecker = Store<
    (params?: { ctx?: RuleExecutorContext }) => (params: { condition: ConditionNode; ownerComponentId?: EntityId }) => boolean
>

export type GetInstancesByTemplateDepFn = Store<(params: { ownerComponentId?: EntityId }) => (depTemplateId: EntityId) => EntityId[]>

export type ComponentsTemplates = {
    componentIdToTemplateId: Record<EntityId, EntityId>
    templateIdToComponentsIds: Record<EntityId, Set<EntityId>>
}

export type ComponentToUpdate = {
    componentId: EntityId
    schema: ComponentSchema
    isNewValue?: boolean
}

export type RunMutationsOnUserActionPayload = { id: EntityId; data: AvailableObject }

export type RunComponentValidationFxDone = {}

export type RunComponentValidationFxFail = { errors: ComponentsValidationErrors[keyof ComponentsValidationErrors] }

export type SetSchemaPayload = { schema: AvailableObject; isNewValue?: boolean }

export type EditableModel = {
    $schema: StoreWritable<EditableComponentSchema>
    $errors: Store<ComponentValidationError[] | null>
    $firstError: Store<ComponentValidationError | null>
    $isRequired: Store<boolean>
    $isValidationPending: StoreWritable<boolean>
    setSchema: EventCallable<SetSchemaPayload>
    onUpdateProperties: EventCallable<Partial<EditableComponentProperties>>
    onBlur: EventCallable<void>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type ContainerModel = {
    $schema: StoreWritable<ContainerComponentSchema>
    setSchema: EventCallable<SetSchemaPayload>
    onUpdateProperties: EventCallable<Partial<ContainerComponentProperties>>
}

export type RepeaterModel = {
    $schema: StoreWritable<RepeaterComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchema: EventCallable<SetSchemaPayload>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type UploaderModel = {
    $schema: StoreWritable<UploaderComponentSchema>
    $errors: Store<ComponentValidationError[]>
    $firstError: Store<ComponentValidationError | null>
    $isValidationPending: StoreWritable<boolean>
    $isRequired: StoreWritable<boolean>
    setSchema: EventCallable<SetSchemaPayload>
    onUpdateProperties: EventCallable<Partial<UploaderComponentProperties>>
    runValidationFx: Effect<void, RunComponentValidationFxDone, RunComponentValidationFxFail>
}

export type StaticModel = {
    $schema: StoreWritable<StaticComponentSchema>
    setSchema: EventCallable<SetSchemaPayload>
}

export type ComponentModel = EditableModel | ContainerModel | RepeaterModel | UploaderModel | StaticModel

export type ComponentModelMap = {
    editable: EditableModel
    container: ContainerModel
    repeater: RepeaterModel
    uploader: UploaderModel
    static: StaticModel
}

export type ComponentModelByType<T extends keyof ComponentModelMap> = ComponentModelMap[T]

export type ComponentsModels = Map<EntityId, ComponentModel>
