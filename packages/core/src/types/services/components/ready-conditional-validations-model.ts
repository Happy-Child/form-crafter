import { ComponentsSchemas, EntityId } from '@form-crafter/core'
import { Event as EffectorEvent, EventCallable, StoreWritable } from 'effector'

import { ComponentToUpdate } from './components-model'

export type ReadyValidations = Record<EntityId, Set<EntityId>>

export type ReadyValidationsByKey = Record<EntityId, Record<string, Set<EntityId>>>

export type CalcReadyConditionalValidationsPayload = {
    newComponentsSchemas: ComponentsSchemas
    componentsToUpdate: ComponentToUpdate[]
    skipIfValueUnchanged?: boolean
}

export type ReadyConditionalValidationsModel = {
    calcReadyValidations: EventCallable<CalcReadyConditionalValidationsPayload>
    resultOfCalcReadyValidations: EffectorEvent<{
        readyRules: ReadyValidations
        readyRulesByKey: ReadyValidationsByKey
        readyGroupRules: Set<string>
        readyGroupRulesByKey: Record<string, Set<string>>
        rulesToInactive: Set<string>
    }>
    removeReadyRulesByComponentsIds: EventCallable<Set<string>>
    $readyComponentsRules: StoreWritable<ReadyValidations>
    $readyComponentsRulesByKey: StoreWritable<ReadyValidationsByKey>
    $readyGroupsRules: StoreWritable<ReadyValidations[keyof ReadyValidations]>
    $readyGroupsByKey: StoreWritable<ReadyValidationsByKey[keyof ReadyValidationsByKey]>
}
