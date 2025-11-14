import { ViewElements, ViewElementsGraph } from '@form-crafter/core'

import { buildViewElementsGraph } from '.'

describe('buildViewElementsGraph', () => {
    it('should be correct extract elements', () => {
        const elements: ViewElements = [
            {
                id: 'row1',
                type: 'row',
                children: [
                    {
                        id: 'row1_component1',
                        type: 'component',
                        layout: { col: 'auto' },
                        children: [],
                    },
                ],
            },
            {
                id: 'row2',
                type: 'row',
                children: [
                    {
                        id: 'row2_component1',
                        type: 'component',
                        layout: { col: 'auto' },
                        children: [
                            {
                                id: 'row2_1',
                                type: 'row',
                                children: [],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'row3',
                type: 'row',
                children: [
                    {
                        id: 'row3_component1',
                        type: 'component',
                        layout: { col: 'auto' },
                        children: [
                            {
                                id: 'row3_1',
                                type: 'row',
                                children: [
                                    {
                                        id: 'row3_component2',
                                        layout: { col: 'auto' },
                                        type: 'component',
                                    },
                                    {
                                        id: 'row3_component3',
                                        layout: { col: 'auto' },
                                        type: 'component',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]

        const result = buildViewElementsGraph(elements)

        expect(result).toEqual({
            rows: {
                root: ['row1', 'row2', 'row3'],
                graph: {
                    row1: {
                        id: 'row1',
                        parentComponentId: null,
                        childrenComponents: ['row1_component1'],
                    },
                    row2: {
                        id: 'row2',
                        parentComponentId: null,
                        childrenComponents: ['row2_component1'],
                    },
                    row2_1: {
                        id: 'row2_1',
                        parentComponentId: 'row2_component1',
                        childrenComponents: [],
                    },
                    row3: {
                        id: 'row3',
                        parentComponentId: null,
                        childrenComponents: ['row3_component1'],
                    },
                    row3_1: {
                        id: 'row3_1',
                        parentComponentId: 'row3_component1',
                        childrenComponents: ['row3_component2', 'row3_component3'],
                    },
                },
            },
            components: {
                row1_component1: {
                    id: 'row1_component1',
                    parentRowId: 'row1',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                row2_component1: {
                    id: 'row2_component1',
                    parentRowId: 'row2',
                    childrenRows: ['row2_1'],
                    layout: { col: 'auto' },
                },
                row3_component1: {
                    id: 'row3_component1',
                    parentRowId: 'row3',
                    childrenRows: ['row3_1'],
                    layout: { col: 'auto' },
                },
                row3_component2: {
                    id: 'row3_component2',
                    parentRowId: 'row3_1',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
                row3_component3: {
                    id: 'row3_component3',
                    parentRowId: 'row3_1',
                    childrenRows: [],
                    layout: { col: 'auto' },
                },
            },
        } as ViewElementsGraph)
    })

    it('should be correct extract empty elements', () => {
        const elements: ViewElements = []

        const result = buildViewElementsGraph(elements)

        expect(result).toEqual({ rows: { root: [], graph: {} }, components: {} } as ViewElementsGraph)
    })
})
