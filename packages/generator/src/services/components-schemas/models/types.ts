import { ComponentSchema, ComponentValidationError, EntityId, ValidationsTriggers } from '@form-crafter/core'
import { EventCallable, StoreWritable } from 'effector'

import { SchemaMap } from '../../../types'
import { ThemeService } from '../../theme'
import { CalcRelationsRulesPayload, ComponentsValidationErrors, ReadyConditionalValidationsRules } from '../types'

export type RunValidationFxDone = {}

export type RunValidationFxFail = { errors: ComponentValidationError[] }

export type GeneralSchemaModelParams = {}

export type ComponentSchemaModelParams = {
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $readyConditionalValidationsRules: StoreWritable<ReadyConditionalValidationsRules>
    $componentsValidationErrors: StoreWritable<ComponentsValidationErrors>
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
    runRelationsRulesEvent: EventCallable<CalcRelationsRulesPayload>
    updateComponentsValidationErrorsEvent: EventCallable<{ componentId: EntityId; errors: ComponentValidationError[] }>
    removeComponentValidationErrorsEvent: EventCallable<{ componentId: EntityId }>
}
