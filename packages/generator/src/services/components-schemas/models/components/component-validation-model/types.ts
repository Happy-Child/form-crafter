import { ComponentSchema } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../theme'
import { ReadyValidations } from '../../ready-conditional-validations-model'
import { ComponentModelParams } from '../types'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    getExecutorContextBuilder: UnitValue<ComponentModelParams['componentsModel']['$getExecutorContextBuilder']>
    readyComponentConditionalValidations: ReadyValidations[keyof ReadyValidations] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
