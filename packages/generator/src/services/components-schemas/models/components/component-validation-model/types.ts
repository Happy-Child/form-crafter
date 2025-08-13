import { ComponentSchema } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../theme'
import { ReadyValidationsRules } from '../../ready-conditional-validation-rules-model'
import { ComponentModelParams } from '../types'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    getExecutorContextBuilder: UnitValue<ComponentModelParams['componentsModel']['$getExecutorContextBuilder']>
    readyComponentConditionalValidationRules: ReadyValidationsRules[keyof ReadyValidationsRules] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
