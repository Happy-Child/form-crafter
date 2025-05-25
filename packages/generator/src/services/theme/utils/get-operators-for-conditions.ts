import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions, ComponentModule, isComponentModuleWithRelations } from '@form-crafter/core'

export const getOperatorsForConditions = (theme: ComponentModule[]): Record<string, ComponentConditionOperator | ComponentConditionOperatorWithoutOptions> =>
    theme.reduce((obj, module) => {
        if (isComponentModuleWithRelations(module)) {
        }
        return { ...obj }
    }, {})
