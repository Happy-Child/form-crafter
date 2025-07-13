import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions, ComponentModule, isComponentModuleWithOperators } from '@form-crafter/core'
import { isNotEmpty } from '@form-crafter/utils'
import { StoreValue } from 'effector'

import { OperatorsForConditionsStore } from '../types'

type Return = Record<string, ComponentConditionOperator | ComponentConditionOperatorWithoutOptions>

export const extractOperatorsForConditions = (theme: ComponentModule[]): StoreValue<OperatorsForConditionsStore> =>
    theme.reduce<Return>((map, componentModule) => {
        if (isComponentModuleWithOperators(componentModule) && isNotEmpty(componentModule.operatorsForConditions)) {
            const additinalMap = componentModule.operatorsForConditions.reduce((map, operator) => ({ ...map, [operator.name]: operator }), {})
            return { ...map, ...additinalMap }
        }
        return map
    }, {})
