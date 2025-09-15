import { ComponentConditionOperator, ComponentModule, isComponentModuleWithOperators } from '@form-crafter/core'

export const extractOperators = (modules: ComponentModule[]): Record<string, ComponentConditionOperator> =>
    modules.reduce<Record<string, ComponentConditionOperator>>((map, componentModule) => {
        if (isComponentModuleWithOperators(componentModule)) {
            const additinalMap = componentModule.operators.reduce((map, operator) => ({ ...map, [operator.key]: operator }), {})
            return { ...map, ...additinalMap }
        }
        return map
    }, {})
