import { ConditionOperator } from '../types'

export const conditionOperetorExecutor = (operator: ConditionOperator) => {
    switch (operator) {
        case 'and':
            return (values: boolean[]) => values.every((value) => value)
        case 'or':
            return (values: boolean[]) => values.some((value) => value)
        case 'nand':
            return (values: boolean[]) => !values.every((value) => value)
        case 'nor':
            return (values: boolean[]) => !values.some((value) => value)
    }
}
