import { ComponentSchema, GetExecutorContextBuilder, ReadyValidations } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../../theme'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    getExecutorContextBuilder: UnitValue<GetExecutorContextBuilder>
    readyComponentConditionalValidations: ReadyValidations[keyof ReadyValidations] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
