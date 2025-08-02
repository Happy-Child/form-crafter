import { ComponentSchema } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../theme'
import { ReadyValidationsRules } from '../../types'
import { ComponentSchemaModelParams } from '../types'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    componentsSchemasModel: UnitValue<ComponentSchemaModelParams['$componentsSchemasModel']>
    readyComponentConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
