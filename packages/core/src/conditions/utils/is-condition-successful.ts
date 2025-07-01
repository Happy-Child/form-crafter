import { ComponentConditionOperator, ComponentConditionOperatorWithoutOptions } from '../../components-operators'
import { RuleExecutorContext } from '../../rules'
import { ConditionComponentNode, ConditionNode, ConditionOperatorNode, conditionOperetorExecutor, isConditionWithOptions } from '..'

type Params = {
    ctx: RuleExecutorContext
    condition: ConditionNode
    operators: Record<string, ComponentConditionOperator | ComponentConditionOperatorWithoutOptions>
}

const isConditionComponentNode = (condition: ConditionNode): condition is ConditionComponentNode => condition.type === 'component'

// TODO проверить, что operatorName есть в operators
export const isConditionSuccessful = ({ ctx, condition, operators }: Params) => {
    const executeCondition = (condition: ConditionNode): boolean => {
        if (isConditionComponentNode(condition)) {
            const operator = operators[condition.operatorName]

            if (isConditionWithOptions(condition)) {
                return operator.execute(condition.componentId, { ctx, options: condition.options })
            }

            return (operator as ComponentConditionOperatorWithoutOptions).execute(condition.componentId, { ctx })
        }

        const { operator, operands } = condition as ConditionOperatorNode

        const results = operands.map(executeCondition)

        return conditionOperetorExecutor(operator)(results)
    }

    return executeCondition(condition)
}
