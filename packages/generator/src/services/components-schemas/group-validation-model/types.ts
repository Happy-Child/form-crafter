import { EntityId, GroupValidationError } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { SchemaMap } from '../../../types'
import { SchemaService } from '../../schema'
import { ThemeService } from '../../theme'
import { ComponentsValidationErrors, ReadyValidationsRules } from '../types'

export type RunGroupValidationFxParams = {
    componentsValidationErrors: ComponentsValidationErrors
    componentsSchemasModel: SchemaMap
    groupValidationRules: UnitValue<ThemeService['$groupValidationRules']>
    groupValidationSchemas: UnitValue<SchemaService['$groupValidationSchemas']>
    readyConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules]
}

export type RunGroupValidationFxDone = {}

export type RunGroupValidationFxFail =
    | { groupsErrors: Map<EntityId, GroupValidationError>; componentsErrors?: ComponentsValidationErrors }
    | { groupsErrors?: Map<EntityId, GroupValidationError>; componentsErrors: ComponentsValidationErrors }
