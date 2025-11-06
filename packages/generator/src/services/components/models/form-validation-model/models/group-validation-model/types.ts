import { EntityId, GetExecutorContextBuilder, GroupValidationError, ReadyValidations } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { SchemaService } from '../../../../../schema'
import { ThemeService } from '../../../../../theme'
import { ComponentsValidationErrors } from '../../types'

export type RunGroupValidationFxParams = {
    componentsGroupsErrors: ComponentsValidationErrors
    getExecutorContextBuilder: UnitValue<GetExecutorContextBuilder>
    groupValidationRules: UnitValue<ThemeService['$groupValidationRules']>
    groupValidationSchemas: UnitValue<SchemaService['$groupValidationSchemas']>
    readyConditionalValidations: ReadyValidations[keyof ReadyValidations]
}

export type RunGroupValidationFxDone = {}

export type RunGroupValidationFxFail =
    | { groupsErrors: Map<EntityId, GroupValidationError>; componentsErrors?: ComponentsValidationErrors }
    | { groupsErrors?: Map<EntityId, GroupValidationError>; componentsErrors: ComponentsValidationErrors }
