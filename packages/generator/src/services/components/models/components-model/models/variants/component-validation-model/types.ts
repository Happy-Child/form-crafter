import { ComponentSchema } from '@form-crafter/core'
import { UnitValue } from 'effector'

import { ThemeService } from '../../../../../../theme'
import { ReadyValidations } from '../../../../ready-conditional-validations-model'
import { GetExecutorContextBuilder } from '../../../types'

export type RunComponentValidationFxParams<S extends ComponentSchema> = {
    schema: S
    getExecutorContextBuilder: UnitValue<GetExecutorContextBuilder>
    readyComponentConditionalValidations: ReadyValidations[keyof ReadyValidations] | null
    componentsValidationsRules: UnitValue<ThemeService['$componentsValidationsRules']>
}
