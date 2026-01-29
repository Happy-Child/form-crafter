import { ConditionNode } from '@form-crafter/core'

import { extractComponentConditionDeps } from '.'

describe('extractComponentConditionDeps', () => {
    it('should extract components deps from email condition', () => {
        const conditionNode1: ConditionNode = {
            type: 'operator',
            operator: 'and',
            operands: [
                { type: 'component', meta: { id: 'a' }, operator: { key: 'isEmpty' } },
                { type: 'component', meta: { id: 'b' }, operator: { key: 'isEmpty' } },
                {
                    type: 'operator',
                    operator: 'and',
                    operands: [
                        { type: 'component', meta: { id: 's' }, operator: { key: 'isEmpty' } },
                        { type: 'component', meta: { id: 't' }, operator: { key: 'isEmpty' } },
                    ],
                },
            ],
        }
        const result1 = extractComponentConditionDeps(conditionNode1)
        expect(result1).toEqual(new Set(['a', 'b', 's', 't']))

        const conditionNode2: ConditionNode = { type: 'component', meta: { id: 'c' }, operator: { key: 'isEmpty' } }
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
