import { EntityId, GroupValidationError } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { SchemaService } from '../../schema'
import { ThemeService } from '../../theme'
import { ComponentsSchemasModel } from '../components-models'
import { ReadyValidationsRules } from '../types'
import { ComponentsValidationErrors } from '../validations-errors-model'

export type RunGroupValidationFxParams = {
    componentsGroupsValidationErrors: ComponentsValidationErrors
    componentsSchemasModel: ComponentsSchemasModel
    groupValidationRules: UnitValue<ThemeService['$groupValidationRules']>
    groupValidationSchemas: UnitValue<SchemaService['$groupValidationSchemas']>
    readyConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules]
}

export type RunGroupValidationFxDone = {}

export type RunGroupValidationFxFail =
    | { groupsErrors: Map<EntityId, GroupValidationError>; componentsErrors?: ComponentsValidationErrors }
    | { groupsErrors?: Map<EntityId, GroupValidationError>; componentsErrors: ComponentsValidationErrors }
