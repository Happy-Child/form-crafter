import { isNotEmpty } from '@form-crafter/utils'

import { ComponentModule, ComponentModuleWithMutations } from '../types'

export const isComponentModuleWithMutations = (module: ComponentModule): module is ComponentModuleWithMutations =>
    'mutations' in module && isNotEmpty(module.mutations)
