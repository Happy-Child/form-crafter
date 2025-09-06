import { isNotEmpty } from '@form-crafter/utils'

import { ComponentModule, ComponentModuleWithValidations } from '../types'

export const isComponentModuleWithValidations = (module: ComponentModule): module is ComponentModuleWithValidations =>
    'validations' in module && isNotEmpty(module.validations)
