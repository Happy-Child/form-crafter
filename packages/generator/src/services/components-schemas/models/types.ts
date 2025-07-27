import { ComponentSchema, ComponentValidationError, EntityId, ValidationsTriggers } from '@form-crafter/core'
import { EventCallable, StoreWritable } from 'effector'

import { SchemaMap } from '../../../types'
import { ThemeService } from '../../theme'
import { CalcRelationRulesPayload, ComponentsValidationErrors, ReadyValidationsRules, UpdateComponentValidationErrorsPayload } from '../types'

export type RunComponentValidationFxDone = {}

export type RunComponentValidationFxFail = { errors: ComponentValidationError[] }

export type GeneralSchemaModelParams = {}

export type ComponentSchemaModelParams = {
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $readyConditionalComponentsValidationRules: StoreWritable<ReadyValidationsRules>
    $componentsValidationErrors: StoreWritable<ComponentsValidationErrors>
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
    runRelationRulesEvent: EventCallable<CalcRelationRulesPayload>
    updateComponentValidationErrorsEvent: EventCallable<UpdateComponentValidationErrorsPayload>
    removeComponentValidationErrorsEvent: EventCallable<{ componentId: EntityId }>
}
