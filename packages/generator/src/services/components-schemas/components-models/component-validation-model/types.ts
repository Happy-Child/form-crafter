import { ComponentSchema } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../theme'
import { ReadyValidationsRules } from '../../types'
import { ComponentsValidationErrors } from '../../validations-errors-model'
import { ComponentSchemaModelParams } from '../types'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    componentErrors: ComponentsValidationErrors[keyof ComponentsValidationErrors] | null
    componentsSchemasModel: UnitValue<ComponentSchemaModelParams['$componentsSchemasModel']>
    readyComponentConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
