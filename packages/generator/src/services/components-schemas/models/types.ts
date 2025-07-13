import { ComponentSchema, ValidationsTriggers } from '@form-crafter/core'
import { EventCallable, StoreWritable } from 'effector'

import { SchemaMap } from '../../../types'
import { ThemeService } from '../../theme'
import { CalcRelationsRulesPayload, ReadyConditionalValidationsRules } from '../types'

export type GeneralSchemaModelParams = {}

export type ComponentSchemaModelParams = {
    $componentsSchemasModel: StoreWritable<SchemaMap>
    $readyConditionalValidationsRules: StoreWritable<ReadyConditionalValidationsRules>
    themeService: ThemeService
    schema: ComponentSchema
    additionalTriggers: ValidationsTriggers[] | null
    calcRelationsRulesEvent: EventCallable<CalcRelationsRulesPayload>
}
