import { EntityId, GroupValidationError } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { SchemaService } from '../../../../../schema'
import { ThemeService } from '../../../../../theme'
import { GetExecutorContextBuilder } from '../../../components-model'
import { ReadyValidationsRules } from '../../../ready-conditional-validation-rules-model'
import { ComponentsValidationErrors } from '../../types'

export type RunGroupValidationFxParams = {
    componentsGroupsErrors: ComponentsValidationErrors
    getExecutorContextBuilder: UnitValue<GetExecutorContextBuilder>
    groupValidationRules: UnitValue<ThemeService['$groupValidationRules']>
    groupValidationSchemas: UnitValue<SchemaService['$groupValidationSchemas']>
    readyConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules]
}

export type RunGroupValidationFxDone = {}

export type RunGroupValidationFxFail =
    | { groupsErrors: Map<EntityId, GroupValidationError>; componentsErrors?: ComponentsValidationErrors }
    | { groupsErrors?: Map<EntityId, GroupValidationError>; componentsErrors: ComponentsValidationErrors }
