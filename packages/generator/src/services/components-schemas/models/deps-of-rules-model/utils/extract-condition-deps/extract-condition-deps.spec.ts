import { ConditionNode } from '../../../../../../../../core/src/conditions/types'
import { extractConditionDeps } from '.'

describe('extractConditionDeps', () => {
    it('should extract components deps from email condition', () => {
        const conditionNode1: ConditionNode = {
            type: 'operator',
            operator: 'and',
            operands: [
                { type: 'component', componentId: 'a', operatorKey: 'isEmpty' },
                { type: 'component', componentId: 'b', operatorKey: 'isEmpty' },
                {
                    type: 'operator',
                    operator: 'and',
                    operands: [
                        { type: 'component', componentId: 's', operatorKey: 'isEmpty' },
                        { type: 'component', componentId: 't', operatorKey: 'isEmpty' },
                    ],
                },
            ],
        }
        const result1 = extractConditionDeps([], conditionNode1)
        expect(result1).toEqual(['a', 'b', 's', 't'])

        const conditionNode2: ConditionNode = { type: 'component', componentId: 'c', operatorKey: 'isEmpty' }
        const result2 = extractConditionDeps([], conditionNode2)
        expect(result2).toEqual(['c'])
    })

    it('should be extract empty', () => {
        const conditionNode: ConditionNode = {
            type: 'operator',
            operator: 'and',
            operands: [],
        }
        const result = extractConditionDeps([], conditionNode)
        expect(result).toEqual([])
    })
})
