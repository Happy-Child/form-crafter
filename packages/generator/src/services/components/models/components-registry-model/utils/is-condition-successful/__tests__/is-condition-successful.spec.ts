import { EntityId, RuleExecutorContext } from '@form-crafter/core'

import { isConditionSuccessful } from '..'
import { mockComponentsSchemas, operatorsMock } from './mocks'

const getCtx = (): RuleExecutorContext => ({
    getComponentSchemaById: (componentId: EntityId) => {
        const schema = mockComponentsSchemas[componentId] || null
        return !schema?.visability?.hidden ? schema : null
    },
    getCurrentView: () => null,
    getRepeaterChildIds: () => {
        return []
    },
    isTemplate: (componentId: EntityId) => {
        return false
    },
})

describe('isConditionSuccessful', () => {
    describe('conditions is fulfilled correctly', () => {
        it('return true', () => {
            const ctx = getCtx()

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'component',
                        meta: { id: 'name' },
                        operator: { key: 'isEmpty' },
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(true)

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'operator',
                        operator: 'or',
                        operands: [
                            {
                                type: 'component',
                                meta: { id: 'name' },
                                operator: { key: 'isNotEmpty' },
                            },
                            {
                                type: 'component',
                                meta: { id: 'surname' },
                                operator: { key: 'isNotEmpty' },
                            },
                        ],
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(true)

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'operator',
                        operator: 'or',
                        operands: [
                            {
                                type: 'component',
                                meta: { id: 'surname' },
                                operator: { key: 'isEmpty' },
                            },
                            {
                                type: 'operator',
                                operator: 'and',
                                operands: [
                                    {
                                        type: 'component',
                                        meta: { id: 'name' },
                                        operator: { key: 'isEmpty' },
                                    },
                                    {
                                        type: 'component',
                                        meta: { id: 'patronymic' },
                                        operator: { key: 'isEmpty' },
                                    },
                                ],
                            },
                        ],
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(true)

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'operator',
                        operator: 'and',
                        operands: [
                            {
                                type: 'operator',
                                operator: 'and',
                                operands: [
                                    {
                                        type: 'component',
                                        meta: { id: 'name' },
                                        operator: { key: 'isEmpty' },
                                    },
                                ],
                            },
                            {
                                type: 'operator',
                                operator: 'or',
                                operands: [
                                    {
                                        type: 'component',
                                        meta: { id: 'surname' },
                                        operator: { key: 'isNotEmpty' },
                                    },
                                ],
                            },
                            {
                                type: 'operator',
                                operator: 'and',
                                operands: [
                                    {
                                        type: 'component',
                                        meta: { id: 'patronymic' },
                                        operator: { key: 'isEmpty' },
                                    },
                                ],
                            },
                        ],
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(true)
        })

        it('return false', () => {
            const ctx = getCtx()

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'component',
                        meta: { id: 'name' },
                        operator: { key: 'isNotEmpty' },
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(false)
        })
    })

    describe('strategies if dep is hidden', () => {
        it('skipped if strategy skip', () => {
            const ctx = getCtx()

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'operator',
                        operator: 'and',
                        operands: [
                            {
                                type: 'component',
                                meta: { id: 'surname' },
                                operator: { key: 'isNotEmpty' },
                            },
                            {
                                type: 'component',
                                meta: { id: 'email' },
                                operator: { key: 'isNotEmpty' },
                            },
                        ],
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(true)
        })

        it('true if strategy resolve', () => {
            const ctx = getCtx()

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'component',
                        meta: { id: 'email' },
                        operator: { key: 'isNotEmpty' },
                        strategyIfHidden: 'resolve',
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(true)
        })

        it('false if strategy reject', () => {
            const ctx = getCtx()

            expect(
                isConditionSuccessful({
                    ctx,
                    condition: {
                        type: 'component',
                        meta: { id: 'email' },
                        operator: { key: 'isNotEmpty' },
                        strategyIfHidden: 'reject',
                    },
                    operators: operatorsMock,
                }),
            ).toEqual(false)
        })
    })

    it('empty operands and all skipped conditions return false', () => {
        const ctx = getCtx()

        expect(
            isConditionSuccessful({
                ctx,
                condition: {
                    type: 'operator',
                    operator: 'and',
                    operands: [],
                },
                operators: operatorsMock,
            }),
        ).toEqual(false)

        expect(
            isConditionSuccessful({
                ctx,
                condition: {
                    type: 'component',
                    meta: { id: 'email' },
                    operator: { key: 'isEmpty' },
                },
                operators: operatorsMock,
            }),
        ).toEqual(false)

        expect(
            isConditionSuccessful({
                ctx,
                condition: {
                    type: 'operator',
                    operator: 'or',
                    operands: [
                        {
                            type: 'component',
                            meta: { id: 'email' },
                            operator: { key: 'isNotEmpty' },
                        },
                        {
                            type: 'component',
                            meta: { id: 'phone' },
                            operator: { key: 'isEmpty' },
                        },
                    ],
                },
                operators: operatorsMock,
            }),
        ).toEqual(false)
    })
})
