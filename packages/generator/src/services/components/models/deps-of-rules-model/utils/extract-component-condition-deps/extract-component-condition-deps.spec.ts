import { ConditionNode } from '@form-crafter/core'

import { extractComponentConditionDeps } from '.'

describe('extractComponentConditionDeps', () => {
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
        const result1 = extractComponentConditionDeps(conditionNode1)
        expect(result1).toEqual(new Set(['a', 'b', 's', 't']))

        const conditionNode2: ConditionNode = { type: 'component', componentId: 'c', operatorKey: 'isEmpty' }
        const result2 = extractComponentConditionDeps(conditionNode2)
        expect(result2).toEqual(new Set(['c']))
    })

    it('should be extract empty', () => {
        const conditionNode: ConditionNode = {
            type: 'operator',
            operator: 'and',
            operands: [],
        }
        const result = extractComponentConditionDeps(conditionNode)
        expect(result).toEqual(new Set())
    })
})
