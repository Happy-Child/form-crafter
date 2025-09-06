import { isNotNull, isNull } from '@form-crafter/utils'

import { ComponentConditionOperator } from '../../components-operators'
import { RuleExecutorContext } from '../../rules'
import { ConditionComponentNode, ConditionNode, ConditionOperatorNode, conditionOperetorExecutor } from '..'

type Params = {
    ctx: RuleExecutorContext
    condition: ConditionNode
    operators: Record<string, ComponentConditionOperator>
}

const isConditionComponentNode = (condition: ConditionNode): condition is ConditionComponentNode => condition.type === 'component'

// TODO проверить, что operatorKey есть в operators
export const isConditionSuccessful = ({ ctx, condition, operators }: Params) => {
    const executeCondition = (condition: ConditionNode): boolean | null => {
        if (isConditionComponentNode(condition)) {
            const operator = operators[condition.operatorKey]

            const componentSchema = ctx.getComponentSchemaById(condition.componentId)
            if (isNull(componentSchema)) {
                return null
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

        const { operator, operands } = condition as ConditionOperatorNode

        const results = operands.map(executeCondition).filter(isNotNull)

        return conditionOperetorExecutor(operator)(results)
    }

    return executeCondition(condition)
}
