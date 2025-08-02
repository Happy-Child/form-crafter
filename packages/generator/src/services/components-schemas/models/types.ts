import { ComponentSchema, EntityId, ValidationsTriggers } from '@form-crafter/core'
import { EventCallable, StoreWritable } from 'effector'

import { SchemaMap } from '../../../types'
import { ThemeService } from '../../theme'
import {
    CalcRelationRulesPayload,
    ComponentsValidationErrors,
    ReadyValidationsRules,
    ReadyValidationsRulesByRuleName,
    SetComponentValidationErrorsPayload,
} from '../types'

export type RunComponentValidationFxDone = {}

export type RunComponentValidationFxFail = { errors: ComponentsValidationErrors[keyof ComponentsValidationErrors] }

export type GeneralSchemaModelParams = {}

export type ComponentSchemaModelParams = {
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $readyConditionalValidationRules: StoreWritable<ReadyValidationsRules>
    $readyConditionalValidationRulesByRuleName: StoreWritable<ReadyValidationsRulesByRuleName>
    $componentsValidationErrors: StoreWritable<ComponentsValidationErrors>
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
    runRelationRulesEvent: EventCallable<CalcRelationRulesPayload>
    setComponentValidationErrorsEvent: EventCallable<SetComponentValidationErrorsPayload>
    removeComponentValidationErrorsEvent: EventCallable<EntityId>
}
