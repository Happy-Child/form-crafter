import { ComponentsSchemas, EntityId } from '@form-crafter/core'

import { ComponentToUpdate } from '../components-model'

export type ReadyValidations = Record<EntityId, Set<EntityId>>

export type ReadyValidationsByKey = Record<EntityId, Record<string, Set<EntityId>>>

export type CalcReadyConditionalValidationsPayload = {
    newComponentsSchemas: ComponentsSchemas
    componentsToUpdate: ComponentToUpdate[]
    skipIfValueUnchanged?: boolean
}
