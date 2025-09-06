import { isNotEmpty } from '@form-crafter/utils'

import { ComponentModule, ComponentModuleWithOperators } from '../types'

export const isComponentModuleWithOperators = (module: ComponentModule): module is ComponentModuleWithOperators =>
    'operators' in module && isNotEmpty(module.operators)
