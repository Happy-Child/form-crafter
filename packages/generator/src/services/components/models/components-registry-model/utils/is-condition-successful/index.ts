import { ComponentConditionOperator, ConditionComponentNode, ConditionNode, EntityId, RuleExecutorContext } from '@form-crafter/core'
import { isEmptyArray, isNotEmpty, isNotNull, isNull } from '@form-crafter/utils'

import { conditionOperetorExecutor } from '../condition-operetor-executor'
import { tempFn } from './temp.fn'

const defaultValueOnSkip = false

const getResultIfHidden = (strategy: ConditionComponentNode['strategyIfHidden']) => {
    switch (strategy) {
        case 'skip':
            return null
        case 'resolve':
            return true
        case 'reject':
            return false
        default:
            return null
    }
}

const isComponentConditionNode = (condition: ConditionNode): condition is ConditionComponentNode => condition.type === 'component'

type Params = {
    ctx: RuleExecutorContext
    condition: ConditionNode
    operators: Record<string, ComponentConditionOperator>
    ownerComponentId?: EntityId
}

export const isConditionSuccessful = ({ ctx, condition, operators, ownerComponentId }: Params) => {
    const executeCondition = (condition: ConditionNode): boolean | null => {
        if (isComponentConditionNode(condition)) {
            const operator = operators[condition.operator.key]

            if (isNotEmpty(condition.meta.template)) {
                const templateId = condition.meta.id
                const result = tempFn()
                console.log('result')
            }

            const componentSchema = ctx.getComponentSchemaById(condition.meta.id)
            if (isNull(componentSchema)) {
                return getResultIfHidden(condition.strategyIfHidden)
            }

            if ('options' in condition && 'enteredComponentValue' in condition) {
                return operator.execute(componentSchema, { ctx, options: condition?.options, enteredComponentValue: condition.enteredComponentValue })
            }

            if ('enteredComponentValue' in condition) {
                return operator.execute(componentSchema, { ctx, enteredComponentValue: condition.enteredComponentValue })
            }

            if ('options' in condition) {
                return operator.execute(componentSchema, { ctx, options: condition.options })
            }

            return operator.execute(componentSchema, { ctx })
        }

        const { operator, operands } = condition

        const results = operands.map(executeCondition).filter(isNotNull)

        if (isEmptyArray(results)) {
            return defaultValueOnSkip
        }

        return conditionOperetorExecutor(operator)(results)
    }

    const result = executeCondition(condition)

    return isNull(result) ? defaultValueOnSkip : result
}
