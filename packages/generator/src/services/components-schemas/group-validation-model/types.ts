import { EntityId, GroupValidationError } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { SchemaService } from '../../schema'
import { ThemeService } from '../../theme'
import { GetExecutorContextBuilder, ReadyValidationsRules } from '../types'
import { ComponentsValidationErrors } from '../validations-errors-model'

export type RunGroupValidationFxParams = {
    componentsGroupsValidationErrors: ComponentsValidationErrors
    getExecutorContextBuilder: UnitValue<GetExecutorContextBuilder>
    groupValidationRules: UnitValue<ThemeService['$groupValidationRules']>
    groupValidationSchemas: UnitValue<SchemaService['$groupValidationSchemas']>
    readyConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules]
}

export type RunGroupValidationFxDone = {}

export type RunGroupValidationFxFail =
    | { groupsErrors: Map<EntityId, GroupValidationError>; componentsErrors?: ComponentsValidationErrors }
    | { groupsErrors?: Map<EntityId, GroupValidationError>; componentsErrors: ComponentsValidationErrors }
