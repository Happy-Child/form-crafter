import { ComponentSchema } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../theme'
import { ReadyValidationsRules } from '../../types'
import { ComponentModelParams } from '../types'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    getExecutorContextBuilder: UnitValue<ComponentModelParams['$getExecutorContextBuilder']>
    readyComponentConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
