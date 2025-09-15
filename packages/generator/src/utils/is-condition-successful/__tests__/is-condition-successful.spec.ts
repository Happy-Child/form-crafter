import { EntityId, RuleExecutorContext } from '@form-crafter/core'

import { isConditionSuccessful } from '..'
import { mockComponentsSchemas, operatorsMock } from './mocks'

const getCtx = (): RuleExecutorContext => ({
    getComponentSchemaById: (componentId: EntityId) => {
        const schema = mockComponentsSchemas[componentId] || null
        return !schema?.visability?.hidden ? schema : null
    },
    getRepeaterChildIds: () => {
        return []
    },
    isTemplateComponentId: () => {
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
                        componentId: 'name',
                        operatorKey: 'isEmpty',
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
                                componentId: 'name',
                                operatorKey: 'isNotEmpty',
                            },
                            {
                                type: 'component',
                                componentId: 'surname',
                                operatorKey: 'isNotEmpty',
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
                                componentId: 'surname',
                                operatorKey: 'isEmpty',
                            },
                            {
                                type: 'operator',
                                operator: 'and',
                                operands: [
                                    {
                                        type: 'component',
                                        componentId: 'name',
                                        operatorKey: 'isEmpty',
                                    },
                                    {
                                        type: 'component',
                                        componentId: 'patronymic',
                                        operatorKey: 'isEmpty',
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
                                        componentId: 'name',
                                        operatorKey: 'isEmpty',
                                    },
                                ],
                            },
                            {
                                type: 'operator',
                                operator: 'or',
                                operands: [
                                    {
                                        type: 'component',
                                        componentId: 'surname',
                                        operatorKey: 'isNotEmpty',
                                    },
                                ],
                            },
                            {
                                type: 'operator',
                                operator: 'and',
                                operands: [
                                    {
                                        type: 'component',
                                        componentId: 'patronymic',
                                        operatorKey: 'isEmpty',
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
                        componentId: 'name',
                        operatorKey: 'isNotEmpty',
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
                                componentId: 'surname',
                                operatorKey: 'isNotEmpty',
                            },
                            {
                                type: 'component',
                                componentId: 'email',
                                operatorKey: 'isNotEmpty',
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
                        componentId: 'email',
                        operatorKey: 'isNotEmpty',
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
                        componentId: 'email',
                        operatorKey: 'isNotEmpty',
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
                    componentId: 'email',
                    operatorKey: 'isEmpty',
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
                            componentId: 'email',
                            operatorKey: 'isNotEmpty',
                        },
                        {
                            type: 'component',
                            componentId: 'phone',
                            operatorKey: 'isEmpty',
                        },
                    ],
                },
                operators: operatorsMock,
            }),
        ).toEqual(false)
    })
})
