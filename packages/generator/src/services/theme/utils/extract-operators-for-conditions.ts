import { ComponentConditionOperator, ComponentModule, isComponentModuleWithOperators } from '@form-crafter/core'
import { StoreValue } from 'effector'

import { OperatorsStore } from '../types'

export const extractOperators = (theme: ComponentModule[]): StoreValue<OperatorsStore> =>
    theme.reduce<Record<string, ComponentConditionOperator>>((map, componentModule) => {
        if (isComponentModuleWithOperators(componentModule)) {
            const additinalMap = componentModule.operators.reduce((map, operator) => ({ ...map, [operator.key]: operator }), {})
            return { ...map, ...additinalMap }
        }
        return map
    }, {})
